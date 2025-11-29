//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// ELIMINAMOS LA DEPENDENCIA DE date.js PARA EVITAR ERRORES
// const date = require(__dirname + "/date.js"); 

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- BASES DE DATOS (MAPS) ---
const items = new Map();
const workItems = new Map();

// Datos iniciales
items.set('1', 'Comprar comida');
items.set('2', 'Cocinar comida');
items.set('3', 'Comer comida');

// --- FUNCIÓN DE SEGURIDAD (ANTI-XSS) ---
function escapeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- GENERADOR DE FECHA SIMPLE (Dentro del mismo archivo) ---
function getCurrentDate() {
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-US", options);
}

// --- RUTAS ---

// 1. Ruta Principal (General List)
app.get("/", function (req, res) {
  const day = getCurrentDate(); // Usamos la función interna
  const itemList = Array.from(items, ([uid, text]) => ({ uid, text }));
  
  res.render("list-map", { listTitle: day, newListItems: itemList });
});

// 2. Ruta POST (Añadir Tarea)
app.post("/", function (req, res) {
  const rawItem = req.body.newItem;
  const itemText = escapeHtml(rawItem); 
  const listName = req.body.listName;
  const uid = Date.now().toString(); 

  if (itemText.trim().length === 0) {
      if (listName === "Work") return res.redirect("/work");
      return res.redirect("/");
  }

  if (listName === "Work") {
    workItems.set(uid, itemText);
    res.redirect("/work");
  } else {
    items.set(uid, itemText);
    res.redirect("/");
  }
});

// 3. Ruta Work (Lista de Trabajo)
app.get("/work", function (req, res) {
  const itemList = Array.from(workItems, ([uid, text]) => ({ uid, text }));
  res.render("list-map", { listTitle: "Work", newListItems: itemList });
});

// 4. Ruta Borrar
app.post("/delete", function (req, res) {
  const uidToDelete = req.body.uid;
  const listName = req.body.listName; // En tu EJS esto es el título de la lista

  // TRUCO: A veces el título viene con fecha, así que miramos si NO es Work
  if (listName === "Work") {
    workItems.delete(uidToDelete);
    res.redirect("/work");
  } else {
    items.delete(uidToDelete);
    res.redirect("/");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

// --- SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Servidor iniciado correctamente en el puerto " + PORT);
});




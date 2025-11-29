//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// Asegúrate de que el archivo date.js existe en tu carpeta, si no, comenta esta línea
const date = require(__dirname + "/date.js");

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
// Esta función convierte caracteres peligrosos en seguros
function escapeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- RUTAS ---

// 1. Ruta Principal (General List)
app.get("/", function (req, res) {
  // Si date.js da error, cambia 'day' por un string fijo como "Hoy"
  const day = date.getDay();

  const itemList = Array.from(items, ([uid, text]) => ({ uid, text }));
  
  res.render("list-map", { listTitle: day, newListItems: itemList });
});

// 2. Ruta POST (Añadir Tarea)
app.post("/", function (req, res) {
  // PROTECCIÓN XSS: Limpiamos la entrada antes de guardarla
  const rawItem = req.body.newItem;
  const itemText = escapeHtml(rawItem); 
  
  const listName = req.body.listName;
  const uid = Date.now().toString(); 

  // Validación: No guardar tareas vacías
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
  const listName = req.body.listName;

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




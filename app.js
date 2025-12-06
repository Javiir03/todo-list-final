//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

mongoose.connect("mongodb+srv://javierizquierdorodriguez03_db_user:Promazingerz123%2C@cluster0.qvnn6km.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// 🟢 Schema y Modelo
const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

// 🟢 Datos por defecto
const item1 = new Item({ name: "Buy Food" });
const item2 = new Item({ name: "Cook Food" });
const item3 = new Item({ name: "Eat Food" });

const defaultItems = [item1, item2, item3];

// 🟣 Configuración del servidor
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🟢 Ruta GET principal
app.get("/", function (req, res) {

  Item.find({})
    .then(function(foundItems) {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => console.log("Inserted default items"))
          .catch(err => console.log(err));
        res.redirect("/");
      } else {
        const day = date.getDate();
        res.render("list", { listTitle: day, newListItems: foundItems });
      }

    });

});

// 🟢 Ruta POST para añadir items
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({ name: itemName });
  item.save().then(() => res.redirect("/"));
});

// 🟣 Ruta about
app.get("/about", function (req, res) {
  res.render("about");
});

// 🟣 Iniciar servidor
app.listen(3000, function () {
  console.log("Server started on port 3000");
});


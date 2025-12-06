//jshint esversion:6

// Import the express module to use its functionalities for creating the server.
const express = require("express");
const mongoose = require("mongoose");

// Import the body-parser module, which is used to parse incoming request bodies before your handlers,
// available under the req.body property.
const bodyParser = require("body-parser");

// Import the date module we created earlier which contains the getDate and getDay functions.
// '__dirname' is a global object in Node which returns the directory of the current module.
const date = require(__dirname + "/date.js");

// Initialize a new express application.
const app = express();
mongoose.connect("mongodb+srv://javierizquierdorodriguez03_db_user:Promazingerz123,@cluster0.qvnn6km.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({ name: "Buy Food" });
const item2 = new Item({ name: "Cook Food" });
const item3 = new Item({ name: "Eat Food" });

const defaultItems = [item1, item2, item3];

// Set EJS as the templating engine for the express application.
app.set('view engine', 'ejs');

// Use body-parser middleware to parse form data sent via HTTP POST.
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files, such as CSS or JS, from the 'public' directory.
app.use(express.static("public"));

app.get("/", function (req, res) {

  Item.find({})
    .then(function (foundItems) {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Inserted default items");
          })
          .catch(err => console.log(err));
        res.redirect("/");
      } else {
        const day = date.getDate();
        res.render("list", { listTitle: day, newListItems: foundItems });
      }

    });

});


  // Render the 'list' EJS template and pass in a JavaScript object containing data for the template.
  // 'listTitle' is set to the current day and 'newListItems' is set to the items in our to-do list.
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({ name: itemName });
  item.save().then(() => res.redirect("/"));
});

  // Check if the POST request came from the 'Work' list form.
  if (req.body.list === "Work") {
    // If it is from 'Work', add the item to the workItems array.
    workItems.push(item);
    // Redirect to the '/work' route which will trigger the GET handler for that route.
    res.redirect("/work");
  } else {
    // If it is from the main list, add the item to the items array.
    items.push(item);
    // Redirect back to the root route, which will trigger the GET handler for the root route.
    res.redirect("/");
  }
});

// Define a GET route handler for the '/work' route.
app.get("/work", function (req, res) {
  // Render the 'list' template with 'Work List' as the title and the workItems array for the list items.
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

// Define a GET route handler for the '/about' route.
app.get("/about", function (req, res) {
  // Render the 'about' template. No data is passed to the 'about' template.
  res.render("about");
});

// Start the server on port 3000 and log a message to the console once the server is running.
app.listen(3000, function () {
  console.log("Server started on port 3000");
});


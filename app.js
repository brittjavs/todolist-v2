//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()

const mongoose = require('mongoose');

const uri = process.env.DB_URI
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(uri, {useNewUrlParser: true})

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: "30 minute Yoga"
});

const item2 = new Item({
  name: "Make Breakfast and eat"
});

const item3 = new Item({
  name: "Clean Kitchen"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("Successfully updated Collection")
  }
})

app.get("/", function(req, res) {


  res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

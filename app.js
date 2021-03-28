//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()

const mongoose = require('mongoose');
const _ = require('lodash')

const uri = process.env.DB_URI

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connects to mongodb atlas cluster & database
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

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)



app.get("/", function(req, res) {
  Item.find({}, function(req, foundItems){
    if(foundItems.length ===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err)
        }
        else{
          console.log("Successfully updated Collection")
        }
      })
      res.redirect("/");
      //the redirect will cause the page to refresh and since items have been added it will go to 'else' statement
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize(req.params.customListName)
  List.findOne({name: customListName}, function(err, foundList){
    if(err){
    }
    else{
      if(foundList){
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
      }
      else{
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + customListName)
      }
    }
  })
})

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName= req.body.list;

  const item = new Item({
    name: itemName
  })

  if(listName === "Today"){
    item.save()
    res.redirect("/")
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save()
      res.redirect("/" + listName)
    })
  }

 
})

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("Successfully deleted checked item")
        res.redirect("/")
      }
    })
  }
  else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkedItemId}}},
      function(err, foundList){
        if(err){

        }
        else{
          res.redirect("/" + listName)
        }
      }
    )
  }

  
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

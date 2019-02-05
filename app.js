//jshint esversion:6

//All the modules I used
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Connecting to the mongodb database that will be created called "blogDB"
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const contactContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const aboutContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

const app = express();

//Allows us to use EJS rendering
app.set('view engine', 'ejs');

//Allows us to use post data
app.use(bodyParser.urlencoded({extended: true}));

//Allows us to use the public folder
app.use(express.static("public"));

//Schema for the posts
const postSchema = {
  title: String,
  post: String
};

//Schema for the blogs
const blogSchema = {
  posts: [postSchema]
};

//Creates the blogs collections
const Blog = mongoose.model("Blog", blogSchema);

//Creates the posts collections
const Post = mongoose.model("Post", postSchema);

//Creates the home or starting post when the user reaches localhost: 3000
app.get("/", function(req, res){
  Blog.findOne(function(err, blog){
    if (!err){
      if (!blog){
        console.log("No blog posts");

        makeHomePost();

        res.redirect("/");

      } else {
        res.render("home", {posts: blog.posts});
      }
    }
  });
});

//Allows user to get to the about page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//Allows user to get to the contact page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

//Allows to user to get to the compose page
app.get("/compose", function(req, res){
  res.render("compose");
});

//This allows the user to make a post. If a home post or starting post isn't make
//at the start of the composition of a post, it will be created when the current
//post is created
app.post("/compose", function(req, res){

 const blogTitle = req.body.postTitle;

 const blogPost = req.body.postBody;

 Blog.findOne(function(err, blog){
   if (!err){
     if (!blog){

       makeHomePost();

       res.redirect("/");
     } else {

       const newPost = new Post({
         title: blogTitle,
         post: blogPost
       });

       newPost.save();

       blog.posts.push(newPost);

       blog.save(function(err){
         if (!err){
           res.redirect("/");
         }
       });
     }
   }
 });
});


//If the user would like to go to a certain post; they would have to enter
//"localhost:3000/posts/<article name>"". The "postName" parameter represents the
//name of the article. The callback function then uses "postName" to locate
//the post the user would like to see.
app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.findOne({title: requestedTitle}, function(err, post) {
    if (!err){
      if(post){
      if (post.title === requestedTitle) {
          res.render("post", {
            title: post.title,
            content: post.post
          });
        }
    }
    else {
      {
        console.log("No match found");
      }
    }
  }
});
});

//This function makes the first post
let makeHomePost = function(){
  const homePost = new Post({
    title: "Home",
    post: homeStartingContent
  });


  homePost.save();

  const homeBlog = new Blog({
  });


  homeBlog.save();

  homeBlog.posts.push(homePost);
};

//Server listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

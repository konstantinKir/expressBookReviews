const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   
    const result = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books,null,4)))
        })
    
      return result
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const isbn = req.params.isbn;
 const result = new Promise((resolve, reject) => {
    resolve (res.send(JSON.stringify(books[isbn],null,4)))
   })
        return result
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    
    const result = new Promise((resolve, reject) => {
        const filteredEntries = Object.entries(books).filter(([, v]) => {return v.author === author});
        const filteredObject = Object.fromEntries(filteredEntries);

       resolve ( res.send(JSON.stringify(filteredObject,null,4)))
       
        })
            return result
    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const result = new Promise((resolve, reject) => {
        const filteredEntries = Object.entries(books).filter(([, v]) => {return v.title === title});
        const filteredObject = Object.fromEntries(filteredEntries);
        resolve ( res.send(JSON.stringify(filteredObject,null,4)))
       
    })
        return result
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn].reviews,null,4))
});

module.exports.general = public_users;

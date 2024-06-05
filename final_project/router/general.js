const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!users.find(user => user.username === username)) {
      users.push({username,password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Get the book list available in the shop using async-await with Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        const books = response.data;
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books`);
        const books = response.data;
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on Author using async-await with Axios
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/books`);
        const books = response.data;
        const bookList = Object.values(books).filter(book => book.author === author);
        if (bookList.length > 0) {
            return res.status(200).json(bookList);
        } else {
            return res.status(404).json({ message: "Books not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get all books based on Title using async-await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/books`);
        const books = response.data;
        const bookList = Object.values(books).filter(book => book.title === title);
        if (bookList.length > 0) {
            return res.status(200).json(bookList);
        } else {
            return res.status(404).json({ message: "Books not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; // Find the book with the corresponding ISBN
    if (book) {
        return res.status(200).json(book.reviews); // Return the book reviews if found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return an error message if not found
    }
});

module.exports.general = public_users;

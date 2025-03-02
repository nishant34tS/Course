const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Import delete route from deleteroute.js
const deleteRoute = require('./deleteroute');
app.use('/', deleteRoute);

console.log("Delete route loaded successfully!");

// ✅ Simulated books database (for testing)
const books = [
  { isbn: "9780140435139", title: "The Mayor of Casterbridge", author: "Thomas Hardy", review: "" },
  { isbn: "9780553144314", title: "Future Shock", author: "Alvin Toffler", review: "" }
];

// ✅ Simulated user database
const users = [];

// ✅ Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ error: "Username already exists" });
  }

  users.push({ username, password });
  console.log(`New user registered: ${username}`);
  res.status(201).json({ message: "User registered successfully" });
});

// ✅ DELETE route to delete a book review
app.delete('/books/:isbn/review', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.review = "";
  res.json({ message: "Review deleted successfully", book });
});

// ✅ GET all books using an async callback function
app.get('/books', async (req, res) => {
  try {
    setTimeout(() => {
      res.json({ message: "Books fetched successfully", books });
    }, 1000);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
});

// ✅ Search book by ISBN using Promises
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    const book = books.find(b => b.isbn === isbn);
    book ? resolve(book) : reject("Book not found");
  })
    .then(book => res.json({ message: "Book found", book }))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Search books by Author using Promises
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  new Promise((resolve, reject) => {
    const matchingBooks = books.filter(b => b.author.toLowerCase() === author);
    matchingBooks.length > 0 ? resolve(matchingBooks) : reject("No books found for this author");
  })
    .then(books => res.json({ message: "Books found", books }))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Search books by Title using Promises
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const matchingBooks = books.filter(b => b.title.toLowerCase() === title);
    matchingBooks.length > 0 ? resolve(matchingBooks) : reject("No books found with this title");
  })
    .then(books => res.json({ message: "Books found", books }))
    .catch(error => res.status(404).json({ message: error }));
});

// ✅ Start the server (Only ONE `app.listen` call)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

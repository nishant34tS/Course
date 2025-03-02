const express = require('express');
const router = express.Router();

// Simulated database of book reviews
let books = [
    { isbn: "9780140435139", title: "The Mayor of Casterbridge", review: "Great book!" },
    { isbn: "9780553144314", title: "Future Shock", review: "Interesting read." }
];

// Delete a book review
router.delete('/books/:isbn/review', (req, res) => {
    console.log("Received DELETE request");

    const isbn = req.params.isbn;
    const bookIndex = books.findIndex(b => b.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Remove review
    books[bookIndex].review = "";
    console.log(`Review for book ${isbn} deleted.`);

    res.json({ message: "Review deleted successfully", book: books[bookIndex] });
});

module.exports = router; // Exporting the route instead of running a server

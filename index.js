const express = require("express");
const booky = express();
const database = require("./database");
booky.use(express.json());

booky.get("/", (req, res) => {
     return res.json({ books: database.books});
});



booky.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
        );
        if(getSpecificBook.length === 0){
            return res.json({ 
                error: 'No book found for the ISBN of ${req.params.isbn}',
            });
        }
        return res.json({book: getSpecificBook });
});

booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter((book) => 
    book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0){
        return res.json({ 
            error: 'No book found for the category of ${req.params.isbn}',
        });
    }
    return res.json({book: getSpecificBook });

});

booky.get("/author", (req,res) => {
    return res.json({authors:database.author});
});

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter((author) => 
    author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0){
        return res.json({ 
            error: 'No Author found for the category of ${req.params.isbn}',
        });
    }
    return res.json({book: getSpecificAuthor });

});

booky.get("/publications", (req,res) => {
    return res.json({ publications: database.publication});
});

booky.post("/book/add", (req, res) => {
    console.log(req.body);
    const { newBook } = req.body;
    database.books.push(newBook);
    return res.json({ books: database.books });

});

booky.post("/author/add", (req, res) => {
    const { newAuthor } = req.body;
    database.author.push(newAuthor);
    return res.json({ authors: database.author });
});

booky.put("/book/update/title/:isbn", (req,res) => {
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.title = req.body.newBookTitle;
            return;
        }
    });
    return res.json({books: database.books });

});

booky.put("/book/update/author/:isbn/authorID", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.author.push(parseInt(req.params.authorId));
        }
    });

    database.author.forEach((author) => {
        if (author.id === parseInt(req.params.authorId))
        return author.books.push(req.params.isbn);
    });

    return res.json({ books: database.books, author:database.author, message:"New author was added", });
});

booky.put("/publication/update/:isbn", (req,res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
          return book.authors.push(req.body.newAuthor);
    });

    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
        return author.books.push(req.params.isbn);
    });

    return res.json({
        books: database.books,
        authors: database.authors,
        message: "New author was added",
    });
});

booky.put("/publication/update/book/:isbn", (req, res) => {
    database.publications.forEach((publication) => {
         if(publication.id === req.body.pubId){
             return publication.books.push(req.params.isbn);
         }


    });

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn){
            book.publication = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publications: database.publications,
        message: "Successfully updated publication"
    })

});
booky.listen(3000, () => console.log("Hey server is running"));
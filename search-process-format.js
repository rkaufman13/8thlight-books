const axios = require("axios");

const searchBooks = async (query) => {
  console.log(`Searching for ${query}...`);
  if (query.trim().length > 0) {
    return axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`
      )
      .then((response) => response.data)
      .catch((error) => {
        if (error.code === "ENOTFOUND") {
          console.log(
            "You don't seem to have an internet connection! Try checking your connection and try again."
          );
        } else {
          console.log(error);
        }
      });
  } else {
    console.log("Sorry, I didn't catch that.");
    query = null;
    return query;
  }
};

const processBookData = (data) => {
  let books = data["items"];
  if (books.length) {
    books = books.map((book, i) => {
      return {
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors?.join(", ") || "no author", //in case we have more than one author
        publisher: book.volumeInfo.publisher || "no publisher",
        key: i + 1,
      };
    });
    return books;
  } else {
    console.log("Sorry, no results found.");
    return;
  }
};

const formatBooks = (books) => {
  return books.map((book) => {
    return `${book.key}: "${book.title}", ${book.authors}, ${book.publisher}`;
  });
};

module.exports = { searchBooks, processBookData, formatBooks };

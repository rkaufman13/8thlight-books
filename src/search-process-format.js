const axios = require("axios");

const removeEmoji = (query) => {
  var replacementRegex = new RegExp(
    /�/g
  ); /*on my Mac terminal, all emoji are rendered as the Unicode "replacement" character, so this should catch all emoji and remove them. If there are emoji actually rendering (on some fancy Windows machine maybe?) there's an npm package we could use, but in my tests this didn't seem to do anything. Leaving link here for future reference if this changes as Terminal gets fancier. https://github.com/mathiasbynens/emoji-regex */
  query = query.replace(replacementRegex, "");
  return query;
};

const searchBooks = async (query) => {
  query = removeEmoji(query);
  if (query.trim().length > 0) {
    console.log(`Searching for ${query}...`);
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
  let books = data?.items;
  if (books) {
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
    return false;
  }
};

const formatBooks = (books) => {
  return books.map((book) => {
    return `${book.key}: "${book.title}", ${book.authors}, ${book.publisher}`;
  });
};

module.exports = { searchBooks, processBookData, formatBooks };

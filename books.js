const prompt = require("prompt-sync")({ sigint: true });
const axios = require("axios");

let readingList = [];
let books = [];

const showReadingList = (ask) => {
  if (ask == "ask") {
    console.log("Your reading list...");
  }
  if (!readingList.length) {
    console.log("Your reading list is empty!");
  }
  readingList.forEach((book, i) => console.log(`${i + 1}: ${book}`));
  console.log("===================");
  console.log("Add another book to your list, or try a new search.");
  return;
};

const getUserChoice = () => {
  const query = prompt("");
  if (query == "LIST") {
    showReadingList("ask");
  } else if (query == "") {
    console.log("I didn't quite get that. Care to try again?");
    return;
  } else {
    return query;
  }
};

const addToList = (query, bookList) => {
  book = formatBooks(bookList.filter((book) => book.key == query));
  readingList.push(book[0].slice(3)); //bit of a bodge to get the number of the book out of the otherwise perfectly formatted string--but we know that with only 5 results this number will never change so I feel OK doing so
  console.log("Added to reading list. Your list is now:");
  showReadingList();
};

const searchBooks = async (query) => {
  console.log(`Searching for ${query}...`);
  return axios
    .get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
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

const main = async () => {
  let query = null;
  while (true) {
    if (["1", "2", "3", "4", "5"].includes(query)) {
      addToList(query, books);
    } else if (query) {
      const rawBookData = await searchBooks(query);
      books = processBookData(rawBookData); //this is just the data we need from the api response
      const bookList = formatBooks(books); //this is the pretty version to show to users
      console.log("Your results:");
      bookList.forEach((book) => console.log(book));
      console.log(
        "Add a book to your reading list by typing the number, view your list, or try a new search:"
      );
    } else {
      console.log(
        "Welcome to your reading list! Start by typing a query, or view your reading list by typing LIST."
      );
    }

    query = getUserChoice();
  }
};

main();

//TODOS:
//more instructions on how to access list
//don't search for an empty string
//maybe negative numbers shouldn't be treated as queries
//if it's offline, do something
//more newlines
//add HELP, QUIT, SAVE, LOAD

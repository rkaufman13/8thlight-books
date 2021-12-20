const prompt = require("prompt-sync")({ sigint: true });
const axios = require("axios");
const fs = require("fs");

let readingList = [];
if (fs.existsSync("list.txt")) {
  readingList = fs.readFileSync("list.txt").toString().split(/\n/);
}

let books = [];

const showReadingList = () => {
  if (!readingList.length) {
    console.log(
      "Your reading list is empty! Try searching for some books to add!"
    );
  }
  console.log("===================\n");
  readingList.forEach((book, i) => console.log(`${i + 1}: ${book}`));
  console.log("===================\n");

  return;
};

const showHelp = () => {
  console.log(
    "This program allows you to search for books by keyword, add them to a local reading list, and save that list.\n Here are some things you can try:\n 'L' to see your list. \n 'S' to save your list. \n 'Q' to quit the program. Anything else you type will be treated as a search query and will hopefully return a book you'd like to read!"
  );
};

const saveReadingList = () => {
  fs.writeFileSync("list.txt", readingList.join("\n"), "utf8");
  console.log("Your list has been saved.");
  console.log("===================\n");
};

const deleteReadingList = () => {
  console.log(
    "This action will PERMANENTLY clear your reading list! Are you sure?"
  );
  const confirm = prompt("Type 'YES' to confirm deletion of your list:");
  if (confirm == "YES") {
    try {
      fs.unlinkSync("list.txt");
      readingList = [];
      console.log("Your list has been successfully cleared.");
    } catch (err) {
      console.error(err);
    }
  } else {
    return;
  }
};

const getUserChoice = () => {
  const query = prompt("Query or command:     ");
  switch (query) {
    case "L":
      showReadingList();
      break;
    case "H":
      showHelp();
      break;
    case "Q":
      process.exit();
    case "":
      console.log("I didn't quite get that. Care to try again?");
      break;
    case "S":
      saveReadingList();
      break;
    case "C":
      deleteReadingList();
      break;
    default:
      return query;
  }
};

const addToList = (query, bookList) => {
  book = formatBooks(bookList.filter((book) => book.key == query));
  readingList.push(book[0].slice(3)); //bit of a bodge to get the number of the book out of the otherwise perfectly formatted string--but we know that with only 5 results this number will never change so I feel OK doing so
  console.log("Added to reading list. Your list is now:");
  console.log("===================\n");
  showReadingList();
  console.log(
    "Add another book to your list from the results above, or try a new search."
  );
};

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

const main = async () => {
  let query = null;
  while (true) {
    if (["1", "2", "3", "4", "5"].includes(query)) {
      addToList(query, books);
    } else if (query) {
      const rawBookData = await searchBooks(query);
      if (rawBookData) {
        books = processBookData(rawBookData); //this is just the data we need from the api response
        const bookList = formatBooks(books); //this is the pretty version to show to users
        console.log("Your results:");
        bookList.forEach((book) => console.log(book));
        console.log(
          "\nAdd a book to your reading list by typing its number (1-5). View your (L)ist, or try a new search:\n"
        );
      }
    } else {
      console.log(
        "Welcome to your reading list!\nYou can:\nSearch for a book (type any query)\nView your list (type L)\n(S)ave your list\n(C)lear your list\n(H)elp\n(Q)uit"
      );
    }

    query = getUserChoice();
  }
};

main();

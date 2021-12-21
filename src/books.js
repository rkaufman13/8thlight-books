const prompt = require("prompt-sync")({ sigint: true });
const {
  searchBooks,
  processBookData,
  formatBooks,
} = require("./search-process-format");

const addToList = require("./add");

const { showReadingList } = require("./show");

const {
  saveReadingList,
  deleteReadingList,
  loadReadingList,
} = require("./fs-actions");

let readingList = loadReadingList() || [];

let books = [];

const getUserChoice = () => {
  const query = prompt("Query or command:     ");
  switch (query) {
    case "L":
      showReadingList(readingList);
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
      saveReadingList(readingList);
      break;
    case "C":
      readingList = deleteReadingList(readingList);
      break;
    default:
      return query;
  }
};

const main = async () => {
  let query = null;
  while (true) {
    if (["1", "2", "3", "4", "5"].includes(query)) {
      addToList(query, books, readingList);
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

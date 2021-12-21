const { formatBooks } = require("./search-process-format");
const { showReadingList } = require("./show");

const addToList = (query, bookList, readingList) => {
  book = formatBooks(bookList.filter((book) => book.key == query));
  readingList.push(book[0].slice(3)); //bit of a bodge to get the number of the book out of the otherwise perfectly formatted string--but we know that with only 5 results this number will never change so I feel OK doing so
  console.log("Added to reading list. Your list is now:");
  console.log("===================\n");
  showReadingList(readingList);
  console.log(
    "Add another book to your list from the results above, or try a new search."
  );
};

module.exports = addToList;

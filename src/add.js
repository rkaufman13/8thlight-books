const { showReadingList } = require("./show");

const formatBookForSaving = (book) => {
  return `"${book[0].title}", ${book[0].authors}, ${book[0].publisher}`;
};

const addToList = (query, bookList, readingList) => {
  book = formatBookForSaving(bookList.filter((book) => book.key == query));
  readingList.push(book);
  console.log("Added to reading list. Your list is now:");
  console.log("===================\n");
  showReadingList(readingList);
  console.log(
    "Add another book to your list from the results above, or try a new search."
  );
};

module.exports = addToList;

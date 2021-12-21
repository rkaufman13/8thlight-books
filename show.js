const showReadingList = (readingList) => {
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

module.exports = { showReadingList, showHelp };

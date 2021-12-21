const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

const saveReadingList = (readingList) => {
  if (readingList.length) {
    fs.writeFileSync("list.txt", readingList.join("\n"), "utf8");
    console.log("Your list has been saved.");
    console.log("===================\n");
  } else {
    console.log(
      "No books on your list to save. Add books before saving the list."
    );
    return;
  }
};

const deleteReadingList = (readingList) => {
  if (readingList.length) {
    console.log(
      "This action will PERMANENTLY clear your reading list! Are you sure?"
    );
    const confirm = prompt("Type 'YES' to confirm deletion of your list:");
    if (confirm == "YES") {
      try {
        fs.unlinkSync("list.txt");
        readingList = [];
        console.log("Your list has been successfully cleared.");
        return readingList;
      } catch (err) {
        throw new Error(`An error occurred: ${err}`);
      }
    } else {
      return;
    }
  } else {
    console.log("You don't have a reading list, so you can't clear it.\n");
  }
};

const loadReadingList = () => {
  let readingList = [];
  if (fs.existsSync("list.txt")) {
    readingList = fs.readFileSync("list.txt").toString().split(/\n/);
  }
  return readingList;
};
const fsactions = (module.exports = {
  saveReadingList,
  deleteReadingList,
  loadReadingList,
});

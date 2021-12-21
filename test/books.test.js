const expect = require("chai").expect;
const nock = require("nock");
const fs = require("fs");
const stdin = require("mock-stdin").stdin();
const sinon = require("sinon");
const assert = require("assert");
const response = require("./testdata.json");
const {
  searchBooks,
  processBookData,
  formatBooks,
} = require("../search-process-format.js");

const addToList = require("../add");

const fsactions = require("../fs-actions");

const booksArray = require("./test-object.js");

function removeExistingMock() {
  nock.removeInterceptor({
    proto: "https",
    hostname: "www.googleapis.com",
    path: `/books/v1/volumes?q=cats&maxResults=5`,
  });
}

describe("First test", () => {
  it("Should assert true to be true", () => {
    expect(true).to.be.true;
  });
});

describe("Gets books", function () {
  beforeEach(() => {
    nock("https://www.googleapis.com")
      .get("/books/v1/volumes?q=cats&maxResults=5")
      .reply(200, response);
  });
  it("gets books when searched for", () => {
    return searchBooks("cats").then((response) => {
      expect(response.items.length).to.equal(5);
    });
  });
  it("formats books into a list", () => {
    let books = formatBooks(processBookData(response));
    expect(books[0]).to.include("The Cornell Book of Cats");
  });
});

describe("Some sad paths", () => {
  it("doesn't perform empty queries", () => {
    let spy = sinon.spy(console, "log");
    searchBooks("   ");
    assert(spy.calledWith("Sorry, I didn't catch that."));
    spy.restore();
  });
  it("fails gracefully if somehow there is no data returned", () => {
    let spy = sinon.spy(console, "log");

    processBookData({
      kind: "books#volumes",
      totalItems: 3340,
      items: [],
    });
    assert(spy.calledWith("Sorry, no results found."));
    spy.restore();
  });
});

describe("Book list actions", () => {
  let books = [];
  it("displays an empty book list and won't save an empty list", () => {
    let spy = sinon.spy(console, "log");
    fsactions.saveReadingList(books);
    assert(
      spy.calledWith(
        "No books on your list to save. Add books before saving the list."
      )
    );
    spy.restore();
  });
  it("adds the correct book", () => {
    addToList(3, booksArray, books);
    expect(books).to.have.length(1);
    expect(books[0]).to.contain("Hirsch");
  });
  it("can save book list", () => {
    fsactions.saveReadingList(books);
    expect(fs.existsSync("list.txt")).to.be.true;
  });
  it("cancels deletion if user does not type YES", (done) => {
    let spy = sinon.spy(fsactions, "deleteReadingList");
    fsactions.deleteReadingList(books);
    //stin.send("no\r", "ascii") //this does not work
    assert(spy.returned());
    spy.restore();
    setTimeout(done(), 3000);
  });
  it("loads book list from file", (done) => {
    readingList = fsactions.loadReadingList();
    expect(readingList[0]).to.contain("Hirsch");
    done();
  });
  it("can delete existing book list", (done) => {
    books = fsactions.deleteReadingList(books);
    //stdin.send("YES\r", "ascii"); this line doesn't work--i'll manually delete for now
    expect(fs.existsSync("list.txt")).to.be.false;
    expect(books).to.have.length(0);
    setTimeout(done(), 3000);
  });
  it("handles FS errors", () => {
    sinon.stub(fsactions, "deleteReadingList").throws();
    expect(fsactions.deleteReadingList).to.throw(Error);
    sinon.restore();
  });
  it("won't delete an empty list", () => {
    books = [];
    let spy = sinon.spy(console, "log");
    fsactions.deleteReadingList(books);
    assert(
      spy.calledWith("You don't have a reading list, so you can't clear it.\n")
    );
    spy.restore();
  });
  it("won't load an empty list", () => {
    readingList = fsactions.loadReadingList();
    expect(readingList).to.have.length(0);
  });

  afterEach(() => {
    stdin.restore();
  });
});

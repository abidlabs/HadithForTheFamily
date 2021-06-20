// Global Fields
const date = document.getElementById("date");
const topic = document.getElementById("topic");
const hadith = document.getElementById("hadith");
const book = document.getElementById("book");
const apply = document.getElementById("application");

const GET_PUBLIC_SHEET_CELLS = "https://spreadsheets.google.com/feeds/cells/1OzOb4jUF0OY32RyHuEg1wqGioOkeR76Y5cfpEXfal1s/1/public/full?alt=json";

function fetchSheetData() {
  xhttp = new XMLHttpRequest();

  xhttp.onload = (response) => {
    response = JSON.parse(response.currentTarget.response).feed.entry;
    readLastRow(response);
  };

  xhttp.open("GET", GET_PUBLIC_SHEET_CELLS);
  xhttp.send();

  return xhttp;
}

function readLastRow(response) {
  date.textContent = response[response.length - 5].content.$t;
  topic.textContent = response[response.length - 4].content.$t.toUpperCase();
  hadith.textContent = response[response.length - 3].content.$t;
  book.textContent = response[response.length - 2].content.$t.toUpperCase();
  apply.textContent = response[response.length - 1].content.$t;
}

function loadPageData() {
  fetchSheetData();
}

window.onload = loadPageData;
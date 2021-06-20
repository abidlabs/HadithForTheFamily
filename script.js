// Global Fields
const date = document.getElementById("date");
const topic = document.getElementById("topic");
const hadith = document.getElementById("hadith");
const book = document.getElementById("book");
const apply = document.getElementById("application");

const GET_PUBLIC_SHEET_CELLS = "https://spreadsheets.google.com/feeds/cells/1OzOb4jUF0OY32RyHuEg1wqGioOkeR76Y5cfpEXfal1s/1/public/full?alt=json";

// Sheet Reading Engine
sheetReaders = {
  publicSheetRawCells : {
    // Reads a Public Sheet's Raw Response -> Parses it to JSON -> Extracts the 'feed.entry' which carries all cells of sheets in an array
    URL:GET_PUBLIC_SHEET_CELLS,
    responseExtractor : response => JSON.parse(response.currentTarget.response).feed.entry,
    responseInterpreters: {
      lastRowReader: function readLastRow(response) {
        date.textContent = response[response.length - 5].content.$t;
        topic.textContent = response[response.length - 4].content.$t.toUpperCase();
        hadith.textContent = response[response.length - 3].content.$t;
        book.textContent = response[response.length - 2].content.$t.toUpperCase();
        apply.textContent = response[response.length - 1].content.$t;
      }
    }
  }
}

/**
 * Function for fetching Google Sheets Data
 * This function invokes the response reader function. For changing the response interpretation, change the used sheetReader
 */
function fetchSheetData() {
  xhttp = new XMLHttpRequest();
  const sheetReader = sheetReaders.publicSheetRawCells;

  xhttp.onload = (response) => {
    response = sheetReader.responseExtractor(response);
    // Response received. Invoke the reader;
    sheetReader.responseInterpreters.lastRowReader(response);
  };

  xhttp.open("GET",sheetReader.URL);
  xhttp.send();

  return xhttp;
}


function loadPageData() {
  fetchSheetData();
}

window.onload = loadPageData;
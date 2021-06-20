

// Global Fields
const hadith = document.getElementById("hadith");
const reporter = document.getElementById("reporter");
const source = document.getElementById("source");
const arabic = document.getElementById("arabic");
const translation = document.getElementById("translation");
const apply = document.getElementById("apply");


function fetchSheetData() {
  xhttp = new XMLHttpRequest();

  xhttp.onload = (response) => {
    // const hadith = document.getElementById("hadith");
    // const reporter = document.getElementById("reporter");
    // const source = document.getElementById("source");
    // const translation = document.getElementById("translation");
    // const apply = document.getElementById("apply");

    response = JSON.parse(response.currentTarget.response).feed.entry;
    readLastRow(response);


  };
  xhttp.open("GET", "https://spreadsheets.google.com/feeds/cells/1OzOb4jUF0OY32RyHuEg1wqGioOkeR76Y5cfpEXfal1s/1/public/full?alt=json");
  xhttp.send();
}

function readLastRow(response) {
  hadith.textContent += response[response.length - 5].content.$t;
  reporter.textContent += response[response.length - 4].content.$t
  source.textContent += response[response.length - 3].content.$t;
  translation.textContent += response[response.length - 2].content.$t;
  apply.textContent += response[response.length - 1].content.$t
}

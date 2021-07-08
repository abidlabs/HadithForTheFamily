var navOpened = false;
pages = ['home', 'about', 'getEmail'];
currentPage = pages[0];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const date = document.getElementById("date");
const topic = document.getElementById("topic");
const hadith = document.getElementById("hadith");
const book = document.getElementById("book");
const apply = document.getElementById("application");

const homeDiv = document.getElementById('home')
const loader = document.getElementById('loader')
const root = document.getElementsByTagName('html')[0];

const userEmailInput = document.getElementById("userEmail");
const signup = document.getElementById("signUp");

const GET_PUBLIC_SHEET_CELLS = "https://spreadsheets.google.com/feeds/cells/1OzOb4jUF0OY32RyHuEg1wqGioOkeR76Y5cfpEXfal1s/1/public/full?alt=json";

var loading = true;


// Sheet Reading Engine
sheetReaders = {
  onLoadSuccess: function() {
    disableLoading();
    setTweetText(topic.textContent, hadith.textContent,book.textContent)
  },
  publicSheetRawCells : {
    // Reads a Public Sheet's Raw Response -> Parses it to JSON -> Extracts the 'feed.entry' which carries all cells of sheets in an array
    URL:GET_PUBLIC_SHEET_CELLS,
    responseExtractor : response => JSON.parse(response.currentTarget.response).feed.entry,
    responseInterpreters: {
      lastRowReader: function readLastRow(response, randomizeIfNotLatest = false) {
        var cellsPerRow = 5;
        var iterations = (response.length/5) - 1; // Discount the table header cells
        response.splice(0, cellsPerRow); // Remove table header cells
        var rowsArray = [];
        for (var i = 0; i < iterations; i++) {
          rowsArray.push(response.splice(0, cellsPerRow));
        }

        var today = new Date();
        today = `${monthNames[today.getMonth()]} ${today.getDate()}`
        if (today !== rowsArray[rowsArray.length - 1][0].content.$t && randomizeIfNotLatest) {
          const randomInteger = getRandomInteger(rowsArray.length-1);
          date.textContent = today;
          topic.textContent = rowsArray[randomInteger][1].content.$t.toUpperCase();
          hadith.textContent = rowsArray[randomInteger][2].content.$t
          book.textContent = rowsArray[randomInteger][3].content.$t.toUpperCase();
          apply.textContent = rowsArray[randomInteger][4].content.$t;
        } else {
          date.textContent = rowsArray[rowsArray.length - 1][0].content.$t;
          topic.textContent = rowsArray[rowsArray.length - 1][1].content.$t.toUpperCase();
          hadith.textContent = rowsArray[rowsArray.length - 1][2].content.$t
          book.textContent = rowsArray[rowsArray.length - 1][3].content.$t.toUpperCase();
          apply.textContent = rowsArray[rowsArray.length - 1][4].content.$t;
        }
        return true;
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
    const loadResult = sheetReader.responseInterpreters.lastRowReader(response, true);
    if (loadResult) sheetReaders.onLoadSuccess();
  };

  xhttp.open("GET",sheetReader.URL);
  xhttp.send();

  return xhttp;
}

function loadPageData() {
  enableLoading();
  fetchSheetData();
}

function enableLoading() {
  homeDiv.style.display = 'none';
  loader.style.display = 'block';
}

function disableLoading() {
  loading = false;
  homeDiv.style.display = 'flex';
  loader.style.display = 'none';
  setBackgroundImage();
}

function setBackgroundImage() {
  const width = this.window.innerWidth;
  if (width > 992) root.style.backgroundImage = "url('bg_desktop.jpg')";
  else root.style.backgroundImage = "url('bg_low_res.jpg')";
}


function showContent(pageName) {
  if (pages.indexOf(pageName) < 0) { window.location.reload()}

  if (pageName === currentPage) return;

  document.getElementById(pageName).classList.remove('display-none');
  document.getElementById(currentPage).classList.add('display-none');
  currentPage = pageName;
  closeNav();
  return currentPage;
}

function tempAlert(msg,duration)
{
 var el = document.createElement("div");
 el.setAttribute("style","position:absolute;top:40%;left:20%;background-color:white;");
 el.innerHTML = msg;
 setTimeout(function(){
  el.parentNode.removeChild(el);
 },duration);
 document.body.appendChild(el);
}

function setTweetText(topic, hadith, book) {
  // check for 280 character limit
  const tweet = `${topic}: ${hadith} - ${book}`;
  document.getElementById('share-tweet').href= `https://twitter.com/intent/tweet?text=${tweet}`;
  console.log('tweet', tweet);
}

window.onload = loadPageData;
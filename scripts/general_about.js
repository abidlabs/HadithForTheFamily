var navOpened = false;
pages = ['home', 'about', 'getEmail'];
currentPage = pages[1];
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
    setSocialMediaSharing(topic.textContent, hadith.textContent,book.textContent);
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
  if (width > 992) root.style.backgroundImage = "url('./assets/bg_desktop.jpg')";
  else root.style.backgroundImage = "url('./assets/bg_low_res.jpg')";
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

window.onload = loadPageData;


// Side Nav Scripts Starts

function toggleNav() {
  navOpened = !navOpened;
  if (navOpened) openNav();
  else closeNav();
}

function openNav() {
  document.getElementById("sidenav").style.right = "0vw";
  document.getElementById("navIcon").style.right = "9.5rem";
  document.getElementById("parent").style.right = "15.625rem";

  navOpened = true;
}

function closeNav() {
  document.getElementById("sidenav").style.right = "-15.625rem";
  document.getElementById("navIcon").style.right = "-6.25rem";
  document.getElementById("parent").style.right = "0rem";

  navOpened = false;
}

// Side Nav Script Ends

// Share to Social Media Script Starts

function setSocialMediaSharing() {
  setTwitterSharing();
  setWhatsappSharing();
  setFacebookSharing();
}

function setTwitterSharing(tweet) {
  // check for 280 character limit
  document.getElementById(
    "share-twitter"
  ).href = `https://twitter.com/intent/tweet?text=www.hadithforthefamily.com`;
}

function setWhatsappSharing(text) {
  document.getElementById(
    "share-whatsapp"
  ).href = `https://wa.me/?text=www.hadithforthefamily.com`;
}

function setFacebookSharing(text) {
  document.getElementById(
    "share-facebook"
  ).href = `https://www.facebook.com/sharer/sharer.php?u=www.hadithforthefamily.com`;
}

function toggleShareOptions() {
  const content = document.getElementById("shareOptions");
  const contentDisplay = content.style.display || "none";
  content.style.display = contentDisplay === "none" ? "flex" : "none";
}

function hideShareOptions() {
  document.getElementById("shareOptions").style.display = "none";
}

// Share to Social Media Script Ends

// Email Signup Script Starts

const submitError = document.getElementById("signupError");

function dailyEmailSignup() {
  var db = firebase.database();
  enableLoading();
  var email = document.getElementById("userEmail").value;

  if (!isValidEmail(email)) {
    showSignupError("Invalid Email");
    return;
  }

  const emailFirstLetter = email[0];
  const mailServer = email.split('@')[1].split(/[.#$\[\]]/)[0];

  var usersRef = db.ref(`users/${emailFirstLetter}/${mailServer}`);
  usersRef.push({email: email}, (error) => {
    if (error) {
      // The write failed...
      showSignupError("Failed to save email. Please try again later");
    } else {
      showSignupSuccess();
    }
  });
}

function showSignupError(errorMessage) {
  submitError.innerHTML = errorMessage;
  submitError.style.display = "block";
  disableLoading();
}

function showSignupSuccess() {
  signup.classList.add("success");
  signup.innerHTML = "✔ Signed up";
  userEmailInput.classList.add("submitted");
  submitError.style.display = "none";
  submitError.innerHTML = "";
  disableLoading();
}

function resetSubmitButton() {
  signup.classList.remove("success");
  signup.innerHTML = "Sign up";
  userEmailInput.classList.remove("submitted");
  submitError.style.display = "none";
  submitError.innerHTML = "";
}

function onEmailKeyUp(event) {
  resetSubmitButton();
}


// Email Signup Script Ends

// General Utility Script Starts

function isValidEmail(email) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
     email
    )
  )
    return true;
  return false;
}

function getRandomInteger(max) {
  return Math.floor(Math.random() * max);
}

// General Utility Script Ends

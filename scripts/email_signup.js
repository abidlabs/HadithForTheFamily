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

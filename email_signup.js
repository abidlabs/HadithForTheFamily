const submitError = document.getElementById("signupError");

function dailyEmailSignup() {
  var db = firebase.database();
  enableLoading();
  var email = document.getElementById("userEmail").value;

  if (!isValidEmail(email)) {
    showSignupError("Invalid Email");
    return;
  }

  const username = email.split("@")[0];
  const mailServer = email.split("@")[1];
  var mailServerArray = [mailServer];

  // Check if email already exists
  db.ref()
    .child("users")
    .child(username)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        mailServerArray = snapshot.val();
        if (mailServerArray.indexOf(mailServer) >=0) {
          showSignupError("Email already subscribed");
          return;
        }
        mailServerArray.push(mailServer);
      }
      var usersRef = db.ref("users/" + username);
      usersRef.set(mailServerArray, (error) => {
        if (error) {
          // The write failed...
          showSignupError("Failed to save email. Please try again later");
        } else {
          showSignupSuccess();
        }
      });
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
  console.log(event);
  resetSubmitButton();
}

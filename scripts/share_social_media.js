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
  ).href = `https://wa.me/?text=I'm%20interested%20in%20your%20car%20for%20sale`;
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

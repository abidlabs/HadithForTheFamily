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

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

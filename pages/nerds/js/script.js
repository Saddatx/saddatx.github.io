var link = document.querySelector(".button-write-us")
var popup = document.querySelector(".modal-write-us");
var close = document.querySelector(".modal-close");
var form = popup.querySelector("form");
var login = popup.querySelector("[name=name]");
var email = popup.querySelector("[name=email]");
var text = popup.querySelector("textarea");
var storageLogin = localStorage.getItem("login");
var storageEmail = localStorage.getItem("email");

link.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.add("modal-show");
  if (storageLogin && storageEmail) {
    login.value = storageLogin;
    email.value = storageEmail;
    text.focus();
  } else if (login.value) {
    email.focus();
  } else {
    login.focus();
  }  
});  

close.addEventListener("click", function (evt) {
  evt.preventDefault();
  popup.classList.remove("modal-show");
  popup.classList.remove("modal-error");
});  

form.addEventListener("submit", function(evt) {
  if (!login.value || !email.value || !text.value) {
  evt.preventDefault();
  popup.classList.remove("modal-error");
  popup.offsetWidth = popup.offsetWidth;
  popup.classList.add("modal-error");
  } else {
    localStorage.setItem("login", login.value);
    localStorage.setItem("email", email.value);
  }
});

window.addEventListener("keydown", function (evt) {
if (evt.keyCode === 27) {
  if (popup.classList.contains("modal-show")) {
  popup.classList.remove("modal-show");
  popup.classList.remove("modal-error");
  }
}
});
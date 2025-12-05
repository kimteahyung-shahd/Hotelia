loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const code = document.getElementById("adminCode").value.trim();

  loginUser(email, password, code);
});

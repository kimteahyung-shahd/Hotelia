const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const adminCodeValue = document.getElementById("adminCode").value.trim();

  // Validate all required fields are filled
  if (!name || !email || !password || !confirmPassword) {
    showToast("Please fill all required fields", "error");
    return false;
  }

  const newUser = {
    name: name,
    email: email,
    phone: phone,
    password: password,
    adminAccessCode: adminCodeValue || "" // Use the trimmed value or empty string
  };

  registerUser(newUser);
});
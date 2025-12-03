function registerUser(newUser) {
  fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User registered:", data);
      window.location.href = "home.html";
    })
    .catch((err) => console.log(err));
}

function loginUser(email, password) {
  fetch(`http://localhost:3001/users?email=${email}`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length === 0) {
        showToast("Email not found!", "error");
        return;
      }

      const user = users[0];

      if (user.password === password) {
        showToast("Login Successful!", "success");

        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          window.location.href = "home.html";
        }, 1200);
      } else {
        showToast("Wrong password!", "error");
      }
    })
    .catch((err) => console.log(err));
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast-default");
  const text = document.getElementById("toast-msg");
  const icon = document.getElementById("toast-icon");

  text.textContent = message;

  if (type === "error") {
    icon.innerHTML = `<i class="fas fa-times-circle text-xl text-red-500"></i>`;
  } else {
    icon.innerHTML = `<i class="fas fa-check-circle text-xl text-green-500"></i>`;
  }

  toast.classList.remove("hidden");

  setTimeout(() => {
    hideToast();
  }, 2500);
}

function hideToast() {
  const toast = document.getElementById("toast-default");
  toast.classList.add("hidden");
}

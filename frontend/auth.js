function registerUser(newUser) {
  let url = "http://localhost:3001/users";

  // If admin code exists → save in adminUsers
  if (newUser.adminAccessCode && newUser.adminAccessCode !== "") {
    url = "http://localhost:3001/adminUsers";
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newUser)
  })

    .then((res) => res.json())
    .then((data) => {

      console.log("User registered:", data);
      window.location.href = "./frontend/login.html";
    })
    
    .then(res => res.json())
    .then(data => {

      setTimeout(() => {
        showToast("Registered Successfully!", "success");
        window.location.href = "login.html";
      }, 200);
    })
    .catch(err => console.log(err));
}

function loginUser(email, password ,code = null) {
  fetch(`http://localhost:3001/users?email=${email}`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length === 0) {
        showToast("Email not found!", "error");
        return;
      }})


async function loginUser(email, password, code = "") {
  try {
    // check normal users
    const userRes = await fetch(`http://localhost:3001/users?email=${email}`);
    const users = await userRes.json();

    if (users.length > 0) {
      const user = users[0];

      if (user.password === password) {
        showToast("Login Successful!", "success");
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1000);
        return;
      }
    }

    // check admin users
    const adminRes = await fetch(`http://localhost:3001/adminUsers?email=${email}`);
    const admins = await adminRes.json();

    if (admins.length > 0) {
      const admin = admins[0];

      if (admin.password === password && admin.adminAccessCode === code) {
        showToast("Admin Login Successful!", "success");
        localStorage.setItem("admin", JSON.stringify(admin));
        setTimeout(() => {
          window.location.href = "adminPage.html";
        }, 1000);
        return;
      }
    }

    showToast("Incorrect Email / Password / Code!", "error");

  } catch (err) {
    console.log(err);
  }
}

async function adminLogin(email, password, code) {
  fetch(`http://localhost:3001/users?email=${email}`)
    .then((res) => res.json())
    .then((users) => {
      if (users.length === 0) {
        showToast("Email not found!", "error");
        return;
      }


      const user = users[0];

    // check admin users
    const adminRes = await fetch(
      `http://localhost:3001/adminUsers?email=${email}`
    );
    const admins = await adminRes.json();


      if (user.password === password && user.adminAccessCode === code) {
        
        // login success
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

    showToast("Incorrect Email / Password / Code!", "error");
  }

function showToast(message, type = "success") {
  const toast = document.getElementById("toast-default");
  const text = document.getElementById("toast-msg");
  const icon = document.getElementById("toast-icon");

  // If toast elements are not present, don't throw — just log and return
  if (!toast || !text || !icon) {
    console.warn("Toast elements not found in DOM. Skipping toast display.");
    return;
  }

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
  if (!toast) return;
  toast.classList.add("hidden");
}

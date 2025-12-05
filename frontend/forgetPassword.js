// Add this to your login.js or create a separate forget.js file
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    handleForgotPassword();
  });
}

async function handleForgotPassword() {
  // Step 1: Ask for email using SweetAlert
  const emailResult = await Swal.fire({
    title: "Reset Password",
    text: "Enter your registered email:",
    input: "email",
    inputPlaceholder: "example@email.com",
    showCancelButton: true,
    confirmButtonText: "Next",
    confirmButtonColor: "#0047AB",
    cancelButtonColor: "#6B7280",
    inputValidator: (value) => {
      if (!value) {
        return "You need to enter an email!";
      }
    },
  });

  // If user cancelled, exit
  if (!emailResult.isConfirmed) {
    return;
  }

  const enteredEmail = emailResult.value.trim().toLowerCase();

  try {
    // Check in regular users
    const userRes = await fetch(
      `http://localhost:3001/users?email=${enteredEmail}`
    );
    const users = await userRes.json();

    // Check in admin users
    const adminRes = await fetch(
      `http://localhost:3001/adminUsers?email=${enteredEmail}`
    );
    const admins = await adminRes.json();

    let foundUser = null;
    let isAdmin = false;
    let endpoint = "";

    if (users.length > 0) {
      foundUser = users[0];
      endpoint = `http://localhost:3001/users/${foundUser.id}`;
      isAdmin = false;
    } else if (admins.length > 0) {
      foundUser = admins[0];
      endpoint = `http://localhost:3001/adminUsers/${foundUser.id}`;
      isAdmin = true;
    }

    if (foundUser) {
      // Step 2: Ask for new password using SweetAlert
      const passwordResult = await Swal.fire({
        title: "Enter New Password",
        input: "password",
        inputPlaceholder: "New password (minimum 8 characters)",
        inputAttributes: {
          autocomplete: "new-password",
        },
        showCancelButton: true,
        confirmButtonText: "Reset Password",
        confirmButtonColor: "#0047AB",
        cancelButtonColor: "#6B7280",
        inputValidator: (value) => {
          if (!value) {
            return "You need to enter a password!";
          }
        },
      });

      // If user cancelled, exit
      if (!passwordResult.isConfirmed) {
        return;
      }

      const passValue = passwordResult.value.trim();

      // Update the password
      const updatedUser = { ...foundUser, password: passValue };

      const updateRes = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (updateRes.ok) {
        // Show success message
        await Swal.fire({
          icon: "success",
          title: "Done ✔️",
          text: "Your password has been updated successfully",
          confirmButtonColor: "#0047AB",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        // Show error message
        Swal.fire({
          icon: "error",
          title: "Failed ❌",
          text: "Failed to update password. Please try again.",
          confirmButtonColor: "#0047AB",
        });
      }
    } else {
      // Email not found
      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: "This email is not registered",
        confirmButtonColor: "#0047AB",
      });
    }
  } catch (err) {
    console.error("Error:", err);
    Swal.fire({
      icon: "error",
      title: "Error ❌",
      text: "An error occurred. Please try again.",
      confirmButtonColor: "#0047AB",
    });
  }
}

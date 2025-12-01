// Checkout Management
let selectedPaymentMethod = "card";

// Initialize checkout page
document.addEventListener("DOMContentLoaded", () => {
  cart.init();
  loadCheckoutSummary();
  setupCardFormatting();
});

// Load cart items into checkout summary
function loadCheckoutSummary() {
  const summaryContainer = document.getElementById("checkoutSummary");

  if (cart.items.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Display cart items
  summaryContainer.innerHTML = cart.items
    .map((item) => {
      const nights = cart.calculateNights(item.checkIn, item.checkOut);
      const itemTotal = item.price * nights;

      return `
      <div class="border-b pb-4">
        <div class="flex gap-3">
          <img src="${item.image}" alt="${
        item.name
      }" class="w-20 h-16 object-cover rounded">
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 text-sm">${item.name}</h4>
            <p class="text-xs text-gray-600">${item.location}</p>
            <p class="text-xs text-gray-600">${nights} night${
        nights > 1 ? "s" : ""
      }</p>
            <p class="text-sm font-semibold text-blue-600 mt-1">$${itemTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Calculate totals
  const subtotal = cart.getTotal();
  const serviceFee = cart.items.length * 50;
  const tax = Math.round((subtotal + serviceFee) * 0.14);
  const total = subtotal + serviceFee + tax;

  document.getElementById(
    "subtotalAmount"
  ).textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById("serviceFeeAmount").textContent = `$${serviceFee}`;
  document.getElementById("taxAmount").textContent = `$${tax.toLocaleString()}`;
  document.getElementById(
    "totalAmount"
  ).textContent = `$${total.toLocaleString()}`;
}

// Select payment method
function selectPaymentMethod(method) {
  selectedPaymentMethod = method;

  // Update button styles
  document.querySelectorAll(".payment-method").forEach((btn) => {
    btn.classList.remove("border-blue-600", "bg-blue-50");
    btn.classList.add("border-gray-300");
  });

  document
    .getElementById(`${method}Method`)
    .classList.remove("border-gray-300");
  document
    .getElementById(`${method}Method`)
    .classList.add("border-blue-600", "bg-blue-50");

  // Show/hide payment forms
  document.getElementById("cardPayment").classList.add("hidden");
  document.getElementById("paypalPayment").classList.add("hidden");
  document.getElementById("cashPayment").classList.add("hidden");

  if (method === "card") {
    document.getElementById("cardPayment").classList.remove("hidden");
  } else if (method === "paypal") {
    document.getElementById("paypalPayment").classList.remove("hidden");
  } else if (method === "cash") {
    document.getElementById("cashPayment").classList.remove("hidden");
  }
}

// Setup card number formatting
function setupCardFormatting() {
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvv = document.getElementById("cardCvv");

  if (cardNumber) {
    cardNumber.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\s/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formattedValue;
    });
  }

  if (cardExpiry) {
    cardExpiry.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  if (cardCvv) {
    cardCvv.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
    });
  }
}

// Process payment
function processPayment() {
  // Validate personal information
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!firstName || !lastName || !email || !phone) {
    alert("Please fill in all required personal information fields.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Validate payment method
  if (selectedPaymentMethod === "card") {
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    const cardName = document.getElementById("cardName").value.trim();
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCvv = document.getElementById("cardCvv").value;

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      alert("Please fill in all card details.");
      return;
    }

    if (cardNumber.length < 13) {
      alert("Please enter a valid card number.");
      return;
    }

    if (cardCvv.length !== 3) {
      alert("Please enter a valid CVV.");
      return;
    }
  }

  // Generate confirmation number
  const confirmationNumber =
    "EGYPT-" +
    new Date().getFullYear() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase();
  document.getElementById("confirmationNumber").textContent =
    confirmationNumber;

  // Show success modal
  const modal = document.getElementById("successModal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Clear cart
  cart.clear();

  // Store booking details (optional - for confirmation page)
  const bookingDetails = {
    confirmationNumber: confirmationNumber,
    customerName: `${firstName} ${lastName}`,
    email: email,
    phone: phone,
    paymentMethod: selectedPaymentMethod,
    bookingDate: new Date().toISOString(),
    specialRequests: document.getElementById("specialRequests").value,
  };

  console.log("Booking completed:", bookingDetails);
}

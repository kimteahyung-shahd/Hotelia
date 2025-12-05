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

  const hotelItem = cart.items.find((item) => item.type === "hotel");

  const nights = cart.calculateNights(hotelItem.checkIn, hotelItem.checkOut);
  const roomTotal = hotelItem.price * nights;

  const generateStars = (rating) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars += '<i class="fas fa-star text-yellow-400 text-sm"></i>';
      } else {
        stars += '<i class="far fa-star text-yellow-400 text-sm"></i>';
      }
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate totals
  const subtotal = cart.getTotal();
  const serviceFee = cart.items.length * 50;
  const tax = Math.round((subtotal + serviceFee) * 0.14);
  const total = subtotal + serviceFee + tax;

  summaryContainer.innerHTML = `<div class="mb-6">
      <img
        src="${hotelItem.image}"
        alt="${hotelItem.name}"
        class="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h4 class="text-lg font-bold text-gray-900">
        ${hotelItem.name}
      </h4>
      <div class="flex items-center mt-1">
        ${generateStars(hotelItem.rating || 5)}
        <span class="ml-2 text-sm text-gray-600">${
          hotelItem.rating || 5
        }.0</span>
      </div>
      <p class="text-sm text-gray-600 mt-1">
        <i class="fas fa-map-marker-alt text-[#0047AB] mr-1"></i>
        ${hotelItem.location}
      </p>
    </div>

    <!-- Booking Details -->
    <div class="space-y-3 mb-6 pb-6 border-b">
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-calendar-check text-[#0047AB] mr-2"></i>Check-in
        </span>
        <span class="font-semibold text-gray-900">${formatDate(
          hotelItem.checkIn
        )}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-calendar-times text-[#0047AB] mr-2"></i>Check-out
        </span>
        <span class="font-semibold text-gray-900">${formatDate(
          hotelItem.checkOut
        )}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-moon text-[#0047AB] mr-2"></i>Duration
        </span>
        <span class="font-semibold text-gray-900">${nights} Night${
    nights > 1 ? "s" : ""
  }</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-users text-[#0047AB] mr-2"></i>Guests
        </span>
        <span class="font-semibold text-gray-900">${
          hotelItem.guests || 2
        } Guest${hotelItem.guests > 1 ? "s" : ""}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-bed text-[#0047AB] mr-2"></i>Room Type
        </span>
        <span class="font-semibold text-gray-900">${
          hotelItem.roomType || "Standard Room"
        }</span>
      </div>
      ${
        hotelItem.mealOption && hotelItem.mealOption !== "Room Only"
          ? `
      <div class="flex justify-between items-center">
        <span class="text-gray-600 text-sm">
          <i class="fas fa-utensils text-[#0047AB] mr-2"></i>Meal Plan
        </span>
        <span class="font-semibold text-gray-900">${hotelItem.mealOption}</span>
      </div>
      `
          : ""
      }
    </div>

    <!-- Price Breakdown -->
    <div class="space-y-3 mb-6 pb-6 border-b">
      <h4 class="font-bold text-gray-900 mb-3">Price Details</h4>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Room (${nights} night${
    nights > 1 ? "s" : ""
  })</span>
        <span class="text-gray-900 font-semibold">$${roomTotal.toLocaleString()}</span>
      </div>
      ${
        hotelItem.mealOption && hotelItem.mealOption !== "Room Only"
          ? `
      <div class="flex justify-between items-center">
        <span class="text-gray-600">${hotelItem.mealOption}</span>
        <span class="text-gray-900 font-semibold">$${(
          (hotelItem.mealPrice || 0) * nights
        ).toLocaleString()}</span>
      </div>
      `
          : ""
      }
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Service Fee</span>
        <span class="text-gray-900 font-semibold">$${serviceFee}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Taxes (14%)</span>
        <span class="text-gray-900 font-semibold">$${tax.toLocaleString()}</span>
      </div>
    </div>

    <!-- Total -->
    <div class="flex justify-between items-center mb-6">
      <span class="text-xl font-bold text-gray-900">Total</span>
      <span class="text-3xl font-bold text-[#003072]">$${total.toLocaleString()}</span>
    </div>

    <!-- Info Box -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start">
        <i class="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
        <div class="text-sm text-green-800">
          <p class="font-semibold">Free Cancellation</p>
          <p class="mt-1">
            Cancel up to 48 hours before check-in for a full refund
          </p>
        </div>
      </div>
    </div>
  `;

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

    if (!cardNumber || !cardName) {
      alert("Please fill in all card details.");
      return;
    }

    if (cardNumber.length < 13) {
      alert("Please enter a valid card number.");
      return;
    }
  }

  // Generate confirmation number
  const confirmationNumber =
    "HTLA-" +
    new Date().getFullYear() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase();

  // Get additional details
  const address = document.getElementById("address")?.value || "";
  const city = document.getElementById("city")?.value || "";
  const specialRequests =
    document.getElementById("specialRequests")?.value || "";

  // Store booking details for confirmation page
  const bookingData = {
    confirmationNumber: confirmationNumber,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    address: address,
    city: city,
    paymentMethod: selectedPaymentMethod,
    specialRequests: specialRequests,
    bookingDate: new Date().toISOString(),
  };

  // Store cart items before clearing
  const confirmedCart = JSON.parse(JSON.stringify(cart.items));

  // Save to sessionStorage for confirmation page
  sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
  sessionStorage.setItem("confirmedCart", JSON.stringify(confirmedCart));

  // Clear cart
  cart.clear();

  // Redirect to confirmation page
  window.location.href = "confirmation.html";
}

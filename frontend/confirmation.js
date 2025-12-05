// confirmation.js - Load and display booking confirmation details

document.addEventListener("DOMContentLoaded", () => {
  loadConfirmationDetails();
});

function loadConfirmationDetails() {
  // Get booking data from sessionStorage
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || "{}");
  const cartItems = JSON.parse(sessionStorage.getItem("confirmedCart") || "[]");

  if (!bookingData.confirmationNumber || cartItems.length === 0) {
    // No booking data found, redirect to home
    window.location.href = "home.html";
    return;
  }

  // Display confirmation number
  document.getElementById("confirmationNumber").textContent =
    bookingData.confirmationNumber;

  // Display hotel information
  displayHotelInfo(cartItems);

  // Display guest information
  displayGuestInfo(bookingData);

  // Display reservation details
  displayReservationDetails(cartItems);

  // Display price summary
  displayPriceSummary(cartItems, bookingData);

  // Save booking to "database" (backend)
  saveBookingToDatabase(bookingData, cartItems);
}

async function saveBookingToDatabase(bookingData, cartItems) {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    //save booking data to show in the history page
    const hotels = cartItems.filter((item) => item.type === "hotel");
    const meals = cartItems.filter((item) => item.type === "meal");

    if (hotels.length === 0) {
      return;
    }

    const firstHotel = hotels[0]; // Assuming at least one hotel exists
    const nights = calculateNights(firstHotel.checkIn, firstHotel.checkOut);

    let subtotal = 0;
    hotels.forEach((hotel) => {
      const night = calculateNights(hotel.checkIn, hotel.checkOut);
      subtotal += hotel.price * night;
    });
    meals.forEach((meal) => {
      subtotal += meal.price * (meal.quantity || 1);
    });

    const serviceFee = hotels.length * 50;
    const tax = Math.round((subtotal + serviceFee) * 0.14);
    const total = subtotal + serviceFee + tax;

    const booking = {
      id: generateBookingId(),
      userId: currentUser.id,
      email: currentUser.email,
      confirmationNumber: bookingData.confirmationNumber,
      hotelName: firstHotel.name,
      hotelId: firstHotel.id,
      location: firstHotel.location,
      shortLocation: firstHotel.shortLocation,
      image: firstHotel.image,
      checkIn: firstHotel.checkIn,
      checkOut: firstHotel.checkOut,
      guests: firstHotel.guests || 1,
      roomType: firstHotel.roomType,
      mealOption: firstHotel.mealOption || "Room Only",
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      phone: bookingData.phone,
      paymentMethod: bookingData.paymentMethod,
      subtotal: subtotal,
      serviceFee: serviceFee,
      tax: tax,
      totalAmount: total,
      status: "confirmed",
      bookingDate: bookingData.bookingDate || new Date().toISOString(),
      cancellationDate: null,
      cancellationReason: null,
    };

    console.log("booking to database", booking);

    const response = await fetch("http://localhost:3001/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    if (response.ok) {
      console.log("Booking saved successfully to database");
    } else {
      console.error("Failed to save booking to database");
    }
  } catch (error) {
    console.error("Error saving booking:", error);
  }
}

function generateBookingId() {
  return Math.random().toString(36).substr(2, 9);
}

function displayHotelInfo(cartItems) {
  const hotelInfo = document.getElementById("hotelInfo");
  const hotels = cartItems.filter((item) => item.type === "hotel");

  if (hotels.length === 0) return;

  const html = hotels
    .map(
      (hotel) => `
    <div class="flex gap-4 mb-4">
      <img src="${hotel.image}" alt="${
        hotel.name
      }" class="w-32 h-24 object-cover rounded-lg" />
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-900">${hotel.name}</h3>
        <div class="flex items-center text-gray-600 mt-1">
          <i class="fas fa-map-marker-alt mr-2 text-[#0047AB]"></i>
          <span>${hotel.location}</span>
        </div>
        <div class="flex items-center mt-2">
          ${generateStars(hotel.rating)}
          <span class="ml-2 text-sm text-gray-600">${hotel.rating}.0</span>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  hotelInfo.innerHTML = html;
}

function displayGuestInfo(bookingData) {
  const guestInfo = document.getElementById("guestInfo");

  guestInfo.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p class="text-sm text-gray-600">Full Name</p>
        <p class="font-semibold text-gray-900">${bookingData.firstName} ${
    bookingData.lastName
  }</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Email</p>
        <p class="font-semibold text-gray-900">${bookingData.email}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Phone</p>
        <p class="font-semibold text-gray-900">${bookingData.phone}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Payment Method</p>
        <p class="font-semibold text-gray-900">${getPaymentMethodName(
          bookingData.paymentMethod
        )}</p>
      </div>
      ${
        bookingData.address
          ? `
      <div class="md:col-span-2">
        <p class="text-sm text-gray-600">Address</p>
        <p class="font-semibold text-gray-900">${bookingData.address}${
              bookingData.city ? ", " + bookingData.city : ""
            }${bookingData.country ? ", " + bookingData.country : ""}</p>
      </div>
      `
          : ""
      }
      ${
        bookingData.specialRequests
          ? `
      <div class="md:col-span-2">
        <p class="text-sm text-gray-600">Special Requests</p>
        <p class="font-semibold text-gray-900">${bookingData.specialRequests}</p>
      </div>
      `
          : ""
      }
    </div>
  `;
}

function displayReservationDetails(cartItems) {
  const reservationDetails = document.getElementById("reservationDetails");
  const hotels = cartItems.filter((item) => item.type === "hotel");
  const meals = cartItems.filter((item) => item.type === "meal");

  if (hotels.length === 0) return;

  const html = hotels
    .map((hotel) => {
      const nights = calculateNights(hotel.checkIn, hotel.checkOut);

      return `
      <div class="space-y-3 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-calendar-check text-[#0047AB] mr-2"></i>Check-in
          </span>
          <span class="font-semibold text-gray-900">${formatDate(
            hotel.checkIn
          )}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-calendar-times text-[#0047AB] mr-2"></i>Check-out
          </span>
          <span class="font-semibold text-gray-900">${formatDate(
            hotel.checkOut
          )}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-moon text-[#0047AB] mr-2"></i>Duration
          </span>
          <span class="font-semibold text-gray-900">${nights} Night${
        nights > 1 ? "s" : ""
      }</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-users text-[#0047AB] mr-2"></i>Guests
          </span>
          <span class="font-semibold text-gray-900">${hotel.guests} Guest${
        hotel.guests > 1 ? "s" : ""
      }</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-bed text-[#0047AB] mr-2"></i>Room Type
          </span>
          <span class="font-semibold text-gray-900">${hotel.roomType}</span>
        </div>
        ${
          hotel.mealOption && hotel.mealOption !== "Room Only"
            ? `
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            <i class="fas fa-utensils text-[#0047AB] mr-2"></i>Meal Plan
          </span>
          <span class="font-semibold text-gray-900">${hotel.mealOption}</span>
        </div>
        `
            : ""
        }
      </div>
    `;
    })
    .join("");

  reservationDetails.innerHTML = html;
}

function displayPriceSummary(cartItems, bookingData) {
  const priceSummary = document.getElementById("priceSummary");

  // Calculate totals
  const hotels = cartItems.filter((item) => item.type === "hotel");
  const meals = cartItems.filter((item) => item.type === "meal");

  let subtotal = 0;

  // Hotel costs
  hotels.forEach((hotel) => {
    const nights = calculateNights(hotel.checkIn, hotel.checkOut);
    subtotal += hotel.price * nights;
  });

  // Meal costs
  meals.forEach((meal) => {
    subtotal += meal.price * (meal.quantity || 1);
  });

  const serviceFee = hotels.length * 50;
  const tax = Math.round((subtotal + serviceFee) * 0.14);
  const total = subtotal + serviceFee + tax;

  const html = `
    <div class="space-y-3">
      ${hotels
        .map((hotel) => {
          const nights = calculateNights(hotel.checkIn, hotel.checkOut);
          const hotelTotal = hotel.price * nights;
          return `
        <div class="flex justify-between items-center">
          <span class="text-gray-600">${hotel.name} (${nights} night${
            nights > 1 ? "s" : ""
          })</span>
          <span class="text-gray-900 font-semibold">$${hotelTotal.toLocaleString()}</span>
        </div>
      `;
        })
        .join("")}
      
      ${meals
        .map(
          (meal) => `
        <div class="flex justify-between items-center">
          <span class="text-gray-600">${meal.name}</span>
          <span class="text-gray-900 font-semibold">$${(
            meal.price * (meal.quantity || 1)
          ).toLocaleString()}</span>
        </div>
      `
        )
        .join("")}
      
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Service Fee</span>
        <span class="text-gray-900 font-semibold">$${serviceFee}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-gray-600">Taxes (14%)</span>
        <span class="text-gray-900 font-semibold">$${tax.toLocaleString()}</span>
      </div>
      <div class="border-t pt-3 flex justify-between items-center">
        <span class="text-xl font-bold text-gray-900">Total Amount Paid</span>
        <span class="text-2xl font-bold text-[#0047AB]">$${total.toLocaleString()}</span>
      </div>
    </div>
  `;

  priceSummary.innerHTML = html;
}

// Helper functions
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star text-yellow-400 text-sm"></i>';
  }
  for (let i = fullStars; i < 5; i++) {
    stars += '<i class="far fa-star text-yellow-400 text-sm"></i>';
  }
  return stars;
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPaymentMethodName(method) {
  const methods = {
    card: "Credit Card",
    paypal: "PayPal",
    cash: "Cash at Hotel",
  };
  return methods[method] || "Credit Card";
}

// Cancellation Functions
function showCancellationModal() {
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || "{}");

  // Display the confirmation number in the modal
  document.getElementById("modalConfirmationNumber").textContent =
    bookingData.confirmationNumber || "HTLA-2024-XXXX";

  const modal = document.getElementById("cancellationModal");
  modal.style.display = "flex";
  modal.classList.remove("hidden");
}

function closeCancellationModal() {
  const modal = document.getElementById("cancellationModal");
  modal.style.display = "none";
  modal.classList.add("hidden");

  // Clear the reason field
  document.getElementById("cancellationReason").value = "";
}

async function confirmCancellation() {
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || "{}");
  const cancellationReason =
    document.getElementById("cancellationReason").value;

  // Generate cancellation reference
  const cancellationRef =
    "CANC-" +
    new Date().getFullYear() +
    "-" +
    Math.random().toString(36).substr(2, 9).toUpperCase();

  // Store cancellation data

  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const response = await fetch(
      `http://localhost:3001/bookings?confirmationNumber=${bookingData.confirmationNumber}&userId=${currentUser.id}`
    );

    if (!response.ok) {
      showToast("Failed to fetch booking for cancellation.", "error");
      return;
    }
    const bookings = await response.json();

    if (bookings.length === 0) {
      showToast("Booking not found for cancellation.", "error");
      return;
    }

    const booking = bookings[0];
    const updatedBooking = {
      ...booking,
      status: "cancelled",
      cancellationDate: new Date().toISOString(),
      cancellationReason:
        cancellationReason || "cancellation reason not provided",
      cancellationReference: cancellationRef,
    };
    const updatedResponse = await fetch(
      `http://localhost:3001/bookings/${booking.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      }
    );

    const updated = await updatedResponse.json();
    console.log("Booking cancelled:", updated);
  } catch (error) {}

  showCancellationSuccess(cancellationRef);

  
  const cancellationData = {
  confirmationNumber: bookingData.confirmationNumber,
  cancellationReference: cancellationRef,
  reason: cancellationReason || "cancellation reason not provided",
  date: new Date().toISOString(),
};

  // In a real application, you would send this to your backend
  console.log("Cancellation Data:", cancellationData);

  // Save to localStorage for reference (in real app, this would be in database)
  const cancellations = JSON.parse(
    localStorage.getItem("cancellations") || "[]"
  );
  cancellations.push(cancellationData);
  localStorage.setItem("cancellations", JSON.stringify(cancellations));

  // Update UI with cancellation reference
  document.getElementById("cancellationReference").textContent =
    cancellationRef;

  // Hide cancellation modal, show success modal
  closeCancellationModal();
  const successModal = document.getElementById("cancellationSuccessModal");
  successModal.style.display = "flex";
  successModal.classList.remove("hidden");

  // Clear booking data after cancellation
  sessionStorage.removeItem("bookingData");
  sessionStorage.removeItem("confirmedCart");
}

function showCancellationSuccess(cancellationRef) {
  // Update UI with cancellation reference
  document.getElementById("cancellationReference").textContent =
    cancellationRef;

  // Hide cancellation modal, show success modal
  closeCancellationModal();
  const successModal = document.getElementById("cancellationSuccessModal");
  successModal.style.display = "flex";
  successModal.classList.remove("hidden");

  // Clear booking data after cancellation
  sessionStorage.removeItem("bookingData");
  sessionStorage.removeItem("confirmedCart");
}

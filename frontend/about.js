// about.js - User Profile and Booking History Management

let currentUser = null;
let allBookings = [];
let currentFilter = "all";

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
  cart.init();
  loadUserProfile();
  loadBookingHistory();
  filterBookings('all');
});

// Load user profile from localStorage
function loadUserProfile() {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    // No user logged in, redirect to login
    window.location.href = "login.html";
    return;
  }

  try {
    currentUser = JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user data:", e);
    window.location.href = "login.html";
    return;
  }

  // Display user information
  document.getElementById("userName").textContent =
    currentUser.name || "Guest User";
  document.getElementById("userEmail").textContent = currentUser.email || "";
  document.getElementById("userPhone").textContent =
    currentUser.phone || "No phone number";

  document.getElementById("profileName").textContent =
    currentUser.name || "N/A";
  document.getElementById("profileEmail").textContent =
    currentUser.email || "N/A";
  document.getElementById("profilePhone").textContent =
    currentUser.phone || "N/A";

  // Calculate member since (use current date as placeholder)
  const memberSince = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("memberSince").textContent = memberSince;
}

// Load booking history from database
async function loadBookingHistory() {
  if (!currentUser || !currentUser.id) {
    console.log("no logged in user");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/bookings?userId=${currentUser.id}`
    );
    if (response.ok) {
      allBookings = await response.json();
    } else {
      console.error("Failed to fetch bookings");
      allBookings = [];
    }
  } catch (error) {
    console.error("Error loading bookings:", error);
    allBookings = [];
  }

<<<<<<< HEAD
  // Filter bookings for current user
  if (currentUser && currentUser.email) {
    allBookings = allBookings.filter(
      (booking) => booking.email === currentUser.email
    );
  }

  // Add mock data if no bookings exist (for demonstration)

  // Calculate statistics
=======
>>>>>>> 62d28c0 (last version yarab y3ny)
  calculateStatistics();
  displayBookings();
}

// Calculate user statistics
function calculateStatistics() {
  const confirmedBookings = allBookings.filter((b) => b.status === "confirmed");

  // Total bookings
  document.getElementById("totalBookings").textContent =
    confirmedBookings.length;

  // Total spent
  const totalSpent = confirmedBookings.reduce(
    (sum, booking) => sum + (booking.totalAmount || 0),
    0
  );
  document.getElementById(
    "totalSpent"
  ).textContent = `$${totalSpent.toLocaleString()}`;

  // Favorite location (most visited)
  const locationCounts = {};
  confirmedBookings.forEach((booking) => {
    const location = booking.location || "Unknown";
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  let favoriteLocation = "-";
  let maxCount = 0;
  for (const [location, count] of Object.entries(locationCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteLocation = location;
    }
  }

  document.getElementById("favoriteLocation").textContent = favoriteLocation;
}

// Display bookings based on current filter
function displayBookings() {
  const bookingsList = document.getElementById("bookingsList");

  // Filter bookings
  let filteredBookings = allBookings;
  if (currentFilter === "confirmed") {
    filteredBookings = allBookings.filter((b) => b.status === "confirmed");
  } else if (currentFilter === "cancelled") {
    filteredBookings = allBookings.filter((b) => b.status === "cancelled");
  }

  // Sort by booking date (newest first)
  filteredBookings.sort(
    (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
  );

  // Display bookings
  if (filteredBookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-calendar-times text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No ${
          currentFilter === "all" ? "" : currentFilter
        } bookings found</h3>
        <p class="text-gray-600 mb-6">Start planning your next adventure!</p>
        <a href="hotels.html" class="inline-block bg-[#0047AB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003262] transition">
          Browse Hotels
        </a>
      </div>
    `;
    return;
  }

  bookingsList.innerHTML = filteredBookings
    .map((booking) => {
      const nights = calculateNights(booking.checkIn, booking.checkOut);
      const statusColor = booking.status === "confirmed" ? "green" : "red";
      const statusIcon =
        booking.status === "confirmed" ? "check-circle" : "times-circle";

      return `
      <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
        <div class="flex flex-col md:flex-row gap-4">
          <img src="${booking.image}" alt="${
        booking.hotelName
      }" class="w-full md:w-48 h-32 object-cover rounded-lg">
          
          <div class="flex-1">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-xl font-bold text-gray-900">${
                  booking.hotelName
                }</h3>
                <div class="flex items-center text-gray-600 mt-1">
                  <i class="fas fa-map-marker-alt mr-2 text-[#0047AB]"></i>
                  <span>${booking.location}</span>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <span class="px-3 py-1 rounded-full text-sm font-semibold bg-${statusColor}-100 text-${statusColor}-700 flex items-center">
                  <i class="fas fa-${statusIcon} mr-1"></i>
                  ${
                    booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)
                  }
                </span>
                <span class="text-sm text-gray-500 mt-2">Confirmation: ${
                  booking.confirmationNumber
                }</span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
              <div>
                <span class="text-gray-600">Check-in:</span>
                <p class="font-semibold text-gray-900">${formatDate(
                  booking.checkIn
                )}</p>
              </div>
              <div>
                <span class="text-gray-600">Check-out:</span>
                <p class="font-semibold text-gray-900">${formatDate(
                  booking.checkOut
                )}</p>
              </div>
              <div>
                <span class="text-gray-600">Duration:</span>
                <p class="font-semibold text-gray-900">${nights} night${
        nights > 1 ? "s" : ""
      }</p>
              </div>
              <div>
                <span class="text-gray-600">Guests:</span>
                <p class="font-semibold text-gray-900">${booking.guests}</p>
              </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t">
              <div>
                <span class="text-sm text-gray-600">Room Type: </span>
                <span class="font-semibold text-gray-900">${
                  booking.roomType
                }</span>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-[#0047AB]">$${booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            ${
              booking.status === "cancelled" && booking.cancellationDate
                ? `
              <div class="mt-3 bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                <i class="fas fa-info-circle mr-1"></i>
                Cancelled on ${formatDate(booking.cancellationDate)}
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

async function cancelBooking(bookingId, confirmationNumber) {
  const confirm = confirm(
    `Are you sure you want to cancel booking ${confirmationNumber}?`
  );
  if (!confirm) return;

  try {
    // Fetch existing booking
    const response = await fetch(`http://localhost:3001/bookings/${bookingId}`);
    if (!response.ok) {
      return showToast("Failed to fetch booking details.", "error");
    }

    const booking = await response.json();

    const updatedBooking = {
      ...booking,
      status: "cancelled",
      cancellationDate: new Date().toISOString(),
      cancellationReason: "Cancelled by user",
    };

    // Update booking in database
    const updatedResponse = await fetch(
      `http://localhost:3001/bookings/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      }
    );

    if (updatedResponse.ok) {
      showToast("Booking cancelled successfully.", "success");

      // Refresh booking history to reflect changes
      await loadBookingHistory();
    } else {
      showToast("Failed to cancel booking.", "error");
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    showToast("An error occurred while cancelling the booking.", "error");
  }
}

// Filter bookings
function filterBookings(filter) {
  currentFilter = filter;

  // Update tab styles
  document.querySelectorAll('button[id$="Tab"]').forEach((tab) => {
    tab.classList.remove("text-[#0047AB]", "border-b-2", "border-[#0047AB]");
    tab.classList.add("text-gray-600");
  });

  const activeTab = document.getElementById(`${filter}Tab`);
  activeTab.classList.remove("text-gray-600");
  activeTab.classList.add("text-[#0047AB]", "border-b-2", "border-[#0047AB]");

  // Display filtered bookings
  displayBookings();
}

// Helper: Calculate nights between dates
function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
}

// Helper: Format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Logout function
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

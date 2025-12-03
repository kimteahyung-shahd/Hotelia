// about.js - User Profile and Booking History Management

let currentUser = null;
let allBookings = [];
let currentFilter = "all";

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
  cart.init();
  loadUserProfile();
  loadBookingHistory();
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

// Load booking history from localStorage
function loadBookingHistory() {
  // Get all bookings from localStorage
  const bookingsStr = localStorage.getItem("userBookings");

  if (bookingsStr) {
    try {
      allBookings = JSON.parse(bookingsStr);
    } catch (e) {
      allBookings = [];
    }
  }

  // Filter bookings for current user
  if (currentUser && currentUser.email) {
    allBookings = allBookings.filter(
      (booking) => booking.email === currentUser.email
    );
  }

  // Add mock data if no bookings exist (for demonstration)
  if (allBookings.length === 0) {
    allBookings = generateMockBookings();
  }

  // Calculate statistics
  calculateStatistics();

  // Display bookings
  displayBookings();
}

// Generate mock bookings for demonstration
// function generateMockBookings() {
//   const mockBookings = [
//     {
//       confirmationNumber:
//         "HTLA-2024-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
//       hotelName: "Nile Luxury Resort",
//       location: "Cairo, Egypt",
//       image:
//         "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
//       checkIn: "2024-11-15",
//       checkOut: "2024-11-18",
//       guests: 2,
//       roomType: "Deluxe Room",
//       totalAmount: 5443,
//       status: "confirmed",
//       bookingDate: "2024-10-20",
//       email: currentUser?.email || "user@example.com",
//     },
//     {
//       confirmationNumber:
//         "HTLA-2024-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
//       hotelName: "Red Sea Paradise",
//       location: "Hurghada, Red Sea",
//       image:
//         "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
//       checkIn: "2024-10-05",
//       checkOut: "2024-10-10",
//       guests: 2,
//       roomType: "Sea View Room",
//       totalAmount: 4850,
//       status: "confirmed",
//       bookingDate: "2024-09-15",
//       email: currentUser?.email || "user@example.com",
//     },
//     {
//       confirmationNumber:
//         "HTLA-2024-" + Math.random().toString(36).substr(2, 6).toUpperCase(),
//       hotelName: "Aswan Oasis Retreat",
//       location: "Aswan, Upper Egypt",
//       image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
//       checkIn: "2024-08-20",
//       checkOut: "2024-08-23",
//       guests: 3,
//       roomType: "Suite",
//       totalAmount: 3950,
//       status: "cancelled",
//       bookingDate: "2024-08-01",
//       cancellationDate: "2024-08-18",
//       email: currentUser?.email || "user@example.com",
//     },
//   ];

//   // Save mock bookings
//   localStorage.setItem("userBookings", JSON.stringify(mockBookings));

//   return mockBookings;
// }

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

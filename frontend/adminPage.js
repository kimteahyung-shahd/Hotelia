// Check if admin is logged in
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
  window.location.href = "login.html";
} else {
  document.getElementById("adminName").textContent = admin.name || "Admin";
}

// API Base URL
const API_URL = "http://localhost:3001";

// Room management
let roomCount = 0;

window.addRoomField = function () {
  const container = document.getElementById("roomsContainer");
  const roomId = `room-${roomCount++}`;

  const roomDiv = document.createElement("div");
  roomDiv.className =
    "border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50";
  roomDiv.id = roomId;
  roomDiv.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h5 class="font-medium text-gray-900">Room Type ${roomCount}</h5>
          <button type="button" onclick="removeRoom('${roomId}')" class="text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <input type="text" placeholder="Room Name *" required class="room-name w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          <input type="number" placeholder="Price *" required min="0" class="room-price w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="text" placeholder="Beds (e.g., 1 Double Bed) *" required class="room-beds w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        <div class="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Max Guests *" required min="1" class="room-guests w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Size (e.g., 30 m²) *" required class="room-size w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
        <input type="url" placeholder="Room Image URL *" required class="room-image w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
        <textarea placeholder="Room Description *" required rows="2" class="room-description w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"></textarea>
      `;

  container.appendChild(roomDiv);
};

window.removeRoom = function (roomId) {
  document.getElementById(roomId).remove();
};

// Default meals structure
const defaultMeals = [
  {
    id: "full-board",
    name: "Full Board",
    subtitle: "All meals included",
    price: 85,
    available: true,
    icon: "fa-utensils",
    color: "#E4D00A",
    bgColor: "#F9F6C1",
    features: [
      "Breakfast buffet",
      "Lunch (3-course menu)",
      "Dinner (4-course menu)",
      "Complimentary tea & coffee",
    ],
  },
  {
    id: "half-board",
    name: "Half Board",
    subtitle: "Breakfast & dinner",
    price: 55,
    available: true,
    icon: "fa-coffee",
    color: "#C0C0C0",
    bgColor: "#F0F0F0",
    features: [
      "Breakfast buffet",
      "Dinner (3-course menu)",
      "Complimentary tea & coffee",
    ],
  },
  {
    id: "breakfast-only",
    name: "Breakfast Only",
    subtitle: "Start your day right",
    price: 25,
    available: false,
    icon: "fa-bread-slice",
    color: "#CD7F32",
    bgColor: "#FFE2C4",
    features: [
      "Full breakfast buffet",
      "Fresh juices & beverages",
      "Continental & Egyptian options",
    ],
  },
  {
    id: "room-only",
    name: "Room Only",
    subtitle: "Accommodation without meals",
    price: 0,
    available: true,
    icon: "fa-bed",
    color: "#6B7280",
    bgColor: "#F3F4F6",
  },
];

// Load dashboard data
async function loadDashboard() {
  try {
    const hotelsRes = await fetch(`${API_URL}/hotels`);
    const hotels = await hotelsRes.json();
    document.getElementById("totalHotels").textContent = hotels.length;
    displayHotels(hotels);

    const usersRes = await fetch(`${API_URL}/users`);
    const users = await usersRes.json();
    document.getElementById("totalUsers").textContent = users.length;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    showToast("Error loading dashboard data", "error");
  }
}

// Display hotels in table
function displayHotels(hotels) {
  const tbody = document.getElementById("hotelsTableBody");
  tbody.innerHTML = hotels
    .map((hotel) => {
      // Ensure image exists, otherwise use placeholder
      const imageUrl =
        hotel.image ||
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=64&h=64&fit=crop";
      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4">
            <div class="relative">
              <img src="${imageUrl}" alt="${
        hotel.name
      }" class="w-16 h-16 object-cover rounded-lg" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=64&h=64&fit=crop'" title="${imageUrl}" />
              <span class="absolute bottom-0 right-0 text-xs bg-gray-800 text-white px-1 rounded opacity-0 hover:opacity-100 whitespace-nowrap pointer-events-none">Image</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="font-medium text-gray-900">${hotel.name}</div>
          </td>
          <td class="px-6 py-4 text-gray-600">${hotel.shortLocation}</td>
          <td class="px-6 py-4">
            <span class="font-bold text-[#0047AB]">$${hotel.price}</span>
            <span class="text-sm text-gray-500">/night</span>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center">
              ${generateStars(hotel.rating)}
              <span class="ml-2 text-sm text-gray-600">(${hotel.rating})</span>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="flex space-x-2">
              <button onclick="editHotel('${
                hotel.id
              }')" class="text-blue-600 hover:text-blue-800">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="deleteHotel('${hotel.id}', '${hotel.name.replace(
        /'/g,
        "\\'"
      )}')" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Generate star rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star text-yellow-400"></i>';
  }
  if (hasHalf) {
    stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
  }
  return stars;
}

// Modal functions
window.openAddHotelModal = function () {
  document.getElementById("modalTitle").textContent = "Add New Hotel";
  document.getElementById("hotelForm").reset();
  document.getElementById("hotelId").value = "";
  document.getElementById("roomsContainer").innerHTML = "";
  document
    .querySelectorAll(".amenity-check")
    .forEach((cb) => (cb.checked = false));
  roomCount = 0;
  addRoomField();
  document.getElementById("hotelModal").classList.remove("hidden");
};

window.closeHotelModal = function () {
  document.getElementById("hotelModal").classList.add("hidden");
};

// Edit hotel
window.editHotel = async function (hotelId) {
  try {
    const res = await fetch(`${API_URL}/hotels/${hotelId}`);
    const hotel = await res.json();

    document.getElementById("modalTitle").textContent = "Edit Hotel";
    document.getElementById("hotelId").value = hotel.id;
    document.getElementById("hotelName").value = hotel.name;
    document.getElementById("hotelLocation").value = hotel.location;
    document.getElementById("hotelShortLocation").value = hotel.shortLocation;
    document.getElementById("hotelPrice").value = hotel.price;
    document.getElementById("hotelRating").value = hotel.rating;
    document.getElementById("hotelReviews").value = hotel.reviews || 0;
    document.getElementById("hotelImage").value = hotel.image;
    document.getElementById("hotelDescription").value = hotel.description;

    document.querySelectorAll(".amenity-check").forEach((cb) => {
      cb.checked =
        hotel.amenities &&
        hotel.amenities.some((a) => a.name === cb.dataset.name);
    });

    document.getElementById("roomsContainer").innerHTML = "";
    roomCount = 0;
    if (hotel.rooms && hotel.rooms.length > 0) {
      hotel.rooms.forEach((room) => {
        addRoomField();
        const roomDiv = document.getElementById(`room-${roomCount - 1}`);
        roomDiv.querySelector(".room-name").value = room.name;
        roomDiv.querySelector(".room-price").value = room.price;
        roomDiv.querySelector(".room-beds").value = room.beds;
        roomDiv.querySelector(".room-guests").value = room.guests;
        roomDiv.querySelector(".room-size").value = room.size;
        roomDiv.querySelector(".room-image").value = room.image;
        roomDiv.querySelector(".room-description").value = room.description;
      });
    } else {
      addRoomField();
    }

    document.getElementById("hotelModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error loading hotel:", error);
    showToast("Error loading hotel data", "error");
  }
};

// Delete hotel
window.deleteHotel = async function (hotelId, hotelName) {
  if (!confirm(`Are you sure you want to delete "${hotelName}"?`)) return;

  try {
    await fetch(`${API_URL}/hotels/${hotelId}`, {
      method: "DELETE",
    });
    showToast("Hotel deleted successfully", "success");
    loadDashboard();
  } catch (error) {
    console.error("Error deleting hotel:", error);
    showToast("Error deleting hotel", "error");
  }
};

// Form submission
document.getElementById("hotelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const amenities = [];
  document.querySelectorAll(".amenity-check:checked").forEach((cb) => {
    amenities.push({
      icon: cb.dataset.icon,
      name: cb.dataset.name,
    });
  });

  const rooms = [];
  document.querySelectorAll("#roomsContainer > div").forEach((roomDiv) => {
    rooms.push({
      name: roomDiv.querySelector(".room-name").value,
      description: roomDiv.querySelector(".room-description").value,
      price: parseInt(roomDiv.querySelector(".room-price").value),
      image: roomDiv.querySelector(".room-image").value,
      beds: roomDiv.querySelector(".room-beds").value,
      guests: parseInt(roomDiv.querySelector(".room-guests").value),
      size: roomDiv.querySelector(".room-size").value,
    });
  });

  const hotelId = document.getElementById("hotelId").value;
  const imageUrl = document.getElementById("hotelImage").value.trim();

  // Validate image URL is not empty
  if (!imageUrl) {
    showToast("Please enter a valid image URL", "error");
    return;
  }

  const hotelData = {
    id: hotelId || `hotel-${Date.now()}`,
    name: document.getElementById("hotelName").value,
    location: document.getElementById("hotelLocation").value,
    shortLocation: document.getElementById("hotelShortLocation").value,
    price: parseInt(document.getElementById("hotelPrice").value),
    rating: parseFloat(document.getElementById("hotelRating").value),
    reviews: parseInt(document.getElementById("hotelReviews").value) || 0,
    image: imageUrl,
    description: document.getElementById("hotelDescription").value,
    amenities: amenities,
    rooms: rooms,
    meals: defaultMeals,
  };

  try {
    console.log("Saving hotel:", hotelData);
    if (hotelId) {
      await fetch(`${API_URL}/hotels/${hotelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData),
      });
      showToast("Hotel updated successfully", "success");
    } else {
      await fetch(`${API_URL}/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData),
      });
      showToast("Hotel added successfully", "success");
    }

    closeHotelModal();
    loadDashboard();
  } catch (error) {
    console.error("Error saving hotel:", error);
    showToast("Error saving hotel", "error");
  }
});

// Toast notification
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const icon = document.getElementById("toastIcon");
  const msg = document.getElementById("toastMessage");

  msg.textContent = message;

  if (type === "success") {
    toast.className =
      "fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-50 border-l-4 border-green-500";
    icon.className = "fas fa-check-circle text-2xl mr-3 text-green-500";
  } else {
    toast.className =
      "fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-50 border-l-4 border-red-500";
    icon.className = "fas fa-times-circle text-2xl mr-3 text-red-500";
  }

  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

// Logout
window.logout = function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("admin");
    window.location.href = "login.html";
  }
};
// Load dashboard on page load
loadDashboard();

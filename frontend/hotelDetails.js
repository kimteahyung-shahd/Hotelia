// hotelDetails.js - Dynamic Hotel Details Page with Meal Selection

// Complete hotel database with all details
const hotelDatabase = {
  "nile-luxury": {
    id: "nile-luxury",
    name: "Nile Luxury Resort",
    location: "Corniche El Nil, Cairo, Egypt",
    shortLocation: "Cairo, Egypt",
    price: 1200,
    rating: 5,
    reviews: 248,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    description: "Experience the ultimate luxury on the banks of the majestic Nile River. Our five-star resort offers breathtaking views of the pyramids and combines modern elegance with authentic Egyptian hospitality.",
    amenities: [
      { icon: "fa-swimming-pool", name: "Swimming Pool" },
      { icon: "fa-spa", name: "Spa & Wellness" },
      { icon: "fa-utensils", name: "Restaurant" },
      { icon: "fa-dumbbell", name: "Fitness Center" },
      { icon: "fa-wifi", name: "Free WiFi" },
      { icon: "fa-parking", name: "Free Parking" },
      { icon: "fa-concierge-bell", name: "Room Service" },
      { icon: "fa-cocktail", name: "Bar & Lounge" },
      { icon: "fa-desktop", name: "Business Center" },
    ],
    rooms: [
      {
        name: "Single Room",
        description: "Perfect for solo travelers",
        price: 1200,
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
        beds: "1 Single Bed",
        guests: 1,
        size: "25 m²",
      },
      {
        name: "Double Room",
        description: "Comfortable stay for couples",
        price: 1500,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
        beds: "1 Double Bed",
        guests: 2,
        size: "35 m²",
      },
      {
        name: "Executive Suite",
        description: "Spacious luxury with living area",
        price: 2000,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
        beds: "1 King Bed",
        guests: 3,
        size: "55 m²",
        extras: ["Living Room"],
      },
    ],
  },
  "red-sea": {
    id: "red-sea",
    name: "Red Sea Paradise",
    location: "Hurghada, Red Sea",
    shortLocation: "Hurghada, Red Sea",
    price: 900,
    rating: 4.5,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200",
    description: "Beachfront resort with world-class diving, crystal clear waters and luxurious amenities for a relaxing Red Sea getaway.",
    amenities: [
      { icon: "fa-swimming-pool", name: "Swimming Pool" },
      { icon: "fa-dumbbell", name: "Fitness Center" },
      { icon: "fa-umbrella-beach", name: "Private Beach" },
      { icon: "fa-utensils", name: "Restaurant" },
      { icon: "fa-wifi", name: "Free WiFi" }
    ],
    rooms: [
      { name: "Standard Sea View", description: "Cozy room with sea view", price: 900, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", beds: "1 Double Bed", guests: 2, size: "30 m²" },
      { name: "Deluxe Sea View", description: "Larger room with balcony and sea view", price: 1150, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400", beds: "1 King Bed", guests: 3, size: "40 m²" }
    ]
  },

  "alexandria-bay": {
    id: "alexandria-bay",
    name: "Alexandria Bay Hotel",
    location: "Alexandria, Mediterranean",
    shortLocation: "Alexandria, Mediterranean",
    price: 750,
    rating: 4.4,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200",
    description: "Modern hotel overlooking the Mediterranean with easy access to historic sites and seaside promenades.",
    amenities: [
      { icon: "fa-wifi", name: "Free WiFi" },
      { icon: "fa-parking", name: "Parking" },
      { icon: "fa-utensils", name: "Restaurant" }
    ],
    rooms: [
      { name: "City View", description: "Comfortable room with city or sea views", price: 750, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200", beds: "1 Double Bed", guests: 2, size: "28 m²" },
      { name: "Family Room", description: "Spacious room for families", price: 980, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400", beds: "2 Double Beds", guests: 4, size: "45 m²" }
    ]
  },

  "aswan-oasis": {
    id: "aswan-oasis",
    name: "Aswan Oasis Retreat",
    location: "Aswan, Upper Egypt",
    shortLocation: "Aswan, Upper Egypt",
    price: 850,
    rating: 5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200",
    description: "Boutique hotel near ancient temples with Nile views and traditional hospitality.",
    amenities: [
      { icon: "fa-swimming-pool", name: "Pool" },
      { icon: "fa-spa", name: "Spa" },
      { icon: "fa-concierge-bell", name: "Concierge" }
    ],
    rooms: [
      { name: "Classic Room", description: "Comfortable stay with Nile view options", price: 850, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", beds: "1 Double Bed", guests: 2, size: "30 m²" },
      { name: "Suite", description: "Spacious suite with sitting area", price: 1300, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400", beds: "1 King Bed", guests: 3, size: "50 m²", premium: true }
    ]
  },

  "luxor-valley": {
    id: "luxor-valley",
    name: "Luxor Valley Resort",
    location: "Luxor, Upper Egypt",
    shortLocation: "Luxor, Upper Egypt",
    price: 1100,
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
    description: "Elegant resort steps away from the Valley of the Kings and ancient wonders, offering refined comfort and concierge services.",
    amenities: [
      { icon: "fa-parking", name: "Parking" },
      { icon: "fa-dumbbell", name: "Fitness Center" },
      { icon: "fa-utensils", name: "Fine Dining" }
    ],
    rooms: [
      { name: "Standard", description: "Classic comfort near heritage sites", price: 1100, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200", beds: "1 Double Bed", guests: 2, size: "32 m²" },
      { name: "Royal Suite", description: "Luxurious suite for a memorable stay", price: 2200, image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400", beds: "1 King Bed", guests: 4, size: "75 m²", premium: true }
    ]
  },

  "sharm-paradise": {
    id: "sharm-paradise",
    name: "Sharm Paradise Beach",
    location: "Sharm El Sheikh, Sinai",
    shortLocation: "Sharm El Sheikh, Sinai",
    price: 950,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
    description: "All-inclusive beach resort with spectacular coral reefs, water sports and desert excursions.",
    amenities: [
      { icon: "fa-umbrella-beach", name: "Private Beach" },
      { icon: "fa-swimming-pool", name: "Pool" },
      { icon: "fa-utensils", name: "Restaurants" }
    ],
    rooms: [
      { name: "Beachfront Room", description: "Direct access to the beach", price: 950, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", beds: "1 Double Bed", guests: 2, size: "35 m²" },
      { name: "Family Suite", description: "Room for families with extra space", price: 1400, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400", beds: "2 Double Beds", guests: 4, size: "55 m²" }
    ]
  }
};

// Meal options database
const mealOptions = [
  {
    id: "full-board",
    name: "Full Board",
    subtitle: "All meals included",
    price: 85,
    icon: "fa-utensils",
    color: "#E4D00A",
    bgColor: "#F9F6C1",
    hoverColor: "#C9B609",
    features: [
      "Breakfast buffet",
      "Lunch (3-course menu)",
      "Dinner (4-course menu)",
      "Complimentary tea & coffee"
    ]
  },
  {
    id: "half-board",
    name: "Half Board",
    subtitle: "Breakfast & dinner",
    price: 55,
    icon: "fa-coffee",
    color: "#C0C0C0",
    bgColor: "#F0F0F0",
    hoverColor: "#A8A8A8",
    features: [
      "Breakfast buffet",
      "Dinner (3-course menu)",
      "Complimentary tea & coffee"
    ]
  },
  {
    id: "breakfast-only",
    name: "Breakfast Only",
    subtitle: "Start your day right",
    price: 25,
    icon: "fa-bread-slice",
    color: "#CD7F32",
    bgColor: "#FFE2C4",
    hoverColor: "#B56F28",
    features: [
      "Full breakfast buffet",
      "Fresh juices & beverages",
      "Continental & Egyptian options"
    ]
  },
  {
    id: "room-only",
    name: "Room Only",
    subtitle: "Accommodation without meals",
    price: 0,
    icon: "fa-bed",
    color: "#6B7280",
    bgColor: "#F3F4F6",
    hoverColor: "#4B5563",
    features: []
  }
];

// Current hotel data and selected meal
let currentHotel = null;
let selectedMeal = null;

// Load hotel details on page load
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get("hotel");

  if (hotelId && hotelDatabase[hotelId]) {
    currentHotel = hotelDatabase[hotelId];
    loadHotelDetails(currentHotel);
    setupDateListeners();
    setupMealButtons();
  } else {
    window.location.href = "home.html";
  }
});

// Setup meal selection buttons
function setupMealButtons() {
  mealOptions.forEach(meal => {
    const buttons = document.querySelectorAll(`[data-meal="${meal.id}"]`);
    buttons.forEach(button => {
      button.addEventListener('click', () => selectMeal(meal.id));
    });
  });
}

// Select a specific meal option
function selectMeal(mealId) {
  const meal = mealOptions.find(m => m.id === mealId);
  if (!meal) return;

  selectedMeal = meal;

  // Update all meal buttons to show selection state
  mealOptions.forEach(m => {
    const button = document.querySelector(`[data-meal="${m.id}"]`);
    const card = button.closest('.border');
    
    if (m.id === mealId) {
      // Selected state
      button.textContent = 'Selected ✓';
      button.style.backgroundColor = m.color;
      card.style.borderColor = m.color;
      card.style.borderWidth = '3px';
    } else {
      // Unselected state
      button.textContent = 'Select';
      button.style.backgroundColor = m.color;
      card.style.borderColor = '#E5E7EB';
      card.style.borderWidth = '1px';
    }
  });

  // Recalculate total with meal included
  calculateTotal();

  // Scroll to booking form
  document.querySelector('.sticky').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Load hotel details into page
function loadHotelDetails(hotel) {
  document.getElementById("pageTitle").textContent = `${hotel.name} - Hotelia`;
  document.getElementById("breadcrumbHotel").textContent = hotel.name;
  document.getElementById("hotelMainImage").src = hotel.image;
  document.getElementById("hotelMainImage").alt = hotel.name;
  document.getElementById("hotelName").textContent = hotel.name;
  document.getElementById("hotelLocation").textContent = hotel.location;
  document.getElementById("hotelPrice").textContent = `$${hotel.price}`;
  document.getElementById("hotelDescription").textContent = hotel.description;

  const starsHtml = generateStars(hotel.rating);
  document.getElementById("hotelStars").innerHTML = `
    ${starsHtml}
    <span class="ml-2 text-gray-600 font-medium">${hotel.rating} (${hotel.reviews} reviews)</span>
  `;

  const amenitiesContainer = document.getElementById("hotelAmenities");
  amenitiesContainer.innerHTML = hotel.amenities
    .map(amenity => `
      <div class="flex items-center space-x-3">
        <div class="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
          <i class="fas ${amenity.icon} text-[#003262]"></i>
        </div>
        <span class="text-gray-700 font-medium">${amenity.name}</span>
      </div>
    `).join("");

  const roomsContainer = document.getElementById("availableRooms");
  roomsContainer.innerHTML = hotel.rooms
    .map(room => `
      <div class="border ${room.premium ? "border-gray-200 bg-blue-50" : "border-gray-200"} rounded-lg p-4 hover:shadow-md transition">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative">
            <img src="${room.image}" alt="${room.name}" class="w-full md:w-48 h-32 object-cover rounded-lg" />
            ${room.premium ? '<span class="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-semibold">Premium</span>' : ""}
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-xl font-bold text-gray-900">${room.name}</h3>
                <p class="text-gray-600 text-sm mt-1">${room.description}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-[#0047AB]">$${room.price}</p>
                <p class="text-sm text-gray-500">per night</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 mt-3 mb-3">
              <span class="flex items-center text-sm text-gray-600">
                <i class="fas fa-bed mr-1 text-[#0047AB]"></i> ${room.beds}
              </span>
              <span class="flex items-center text-sm text-gray-600">
                <i class="fas fa-${room.guests > 1 ? "users" : "user"} mr-1 text-[#0047AB]"></i> ${room.guests} Guest${room.guests > 1 ? "s" : ""}
              </span>
              <span class="flex items-center text-sm text-gray-600">
                <i class="fas fa-ruler-combined mr-1 text-[#0047AB]"></i> ${room.size}
              </span>
            </div>
            <button onclick="selectRoom('${room.name}', ${room.price})" class="bg-[#0047AB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003072] transition text-sm">
              Select Room
            </button>
          </div>
        </div>
      </div>
    `).join("");

  const roomSelect = document.getElementById("roomTypeSelect");
  roomSelect.innerHTML = hotel.rooms
    .map(room => `<option value="${room.name}" data-price="${room.price}">${room.name} - $${room.price}/night</option>`)
    .join("");

  calculateTotal();
}

// Generate star rating HTML
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
  for (let i = Math.ceil(rating); i < 5; i++) {
    stars += '<i class="far fa-star text-yellow-400"></i>';
  }
  return stars;
}

// Select a specific room
function selectRoom(roomName, roomPrice) {
  const roomSelect = document.getElementById("roomTypeSelect");
  roomSelect.value = roomName;
  calculateTotal();
  document.querySelector(".sticky").scrollIntoView({ behavior: "smooth" });
}

// Setup date change listeners
function setupDateListeners() {
  const checkIn = document.getElementById("checkInDate");
  const checkOut = document.getElementById("checkOutDate");
  const roomSelect = document.getElementById("roomTypeSelect");

  checkIn.addEventListener("change", calculateTotal);
  checkOut.addEventListener("change", calculateTotal);
  roomSelect.addEventListener("change", calculateTotal);

  const today = new Date().toISOString().split("T")[0];
  checkIn.min = today;
  checkOut.min = today;
}

// Calculate total price including meal option
function calculateTotal() {
  const checkIn = document.getElementById("checkInDate").value;
  const checkOut = document.getElementById("checkOutDate").value;
  const roomSelect = document.getElementById("roomTypeSelect");
  const selectedOption = roomSelect.options[roomSelect.selectedIndex];
  const roomPrice = parseInt(selectedOption.getAttribute("data-price"));
  const guests = parseInt(document.getElementById("numGuests").value.split(" ")[0]) || 1;

  let nights = 1;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (nights < 1) nights = 1;
  }

  const roomSubtotal = roomPrice * nights;
  const serviceFee = 50;
  
  // Calculate meal cost (per person per day)
  let mealCost = 0;
  if (selectedMeal && selectedMeal.price > 0) {
    mealCost = selectedMeal.price * guests * nights;
  }

  const total = roomSubtotal + serviceFee + mealCost;

  // Update the display
  document.getElementById("nightsLabel").textContent = `${nights} night${nights > 1 ? "s" : ""}`;
  document.getElementById("nightsPrice").textContent = `$${roomSubtotal.toLocaleString()}`;
  
  // Add meal cost display if selected
  const existingMealRow = document.getElementById("mealCostRow");
  if (existingMealRow) {
    existingMealRow.remove();
  }

  if (selectedMeal && selectedMeal.price > 0) {
    const serviceFeeRow = document.querySelector('.border-t.pt-4.mt-4').children[1];
    const mealRow = document.createElement('div');
    mealRow.id = "mealCostRow";
    mealRow.className = "flex justify-between items-center mb-2";
    mealRow.innerHTML = `
      <span class="text-gray-600">${selectedMeal.name} (${guests} guest${guests > 1 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''})</span>
      <span class="text-gray-900 font-semibold">$${mealCost.toLocaleString()}</span>
    `;
    serviceFeeRow.parentNode.insertBefore(mealRow, serviceFeeRow);
  }

  document.getElementById("totalPrice").textContent = `$${total.toLocaleString()}`;
}

// Add current hotel to cart
function addCurrentHotelToCart() {
  const checkIn = document.getElementById("checkInDate").value;
  const checkOut = document.getElementById("checkOutDate").value;
  const guests = parseInt(document.getElementById("numGuests").value.split(" ")[0]) || 1;
  const roomType = document.getElementById("roomTypeSelect").value;

  if (!checkIn || !checkOut) {
    alert("Please select check-in and check-out dates");
    return;
  }
  // Add hotel booking (type defaults to 'hotel')
  cart.addItem({
    id: currentHotel.id,
    name: currentHotel.name,
    location: currentHotel.shortLocation,
    price: currentHotel.price,
    image: currentHotel.image,
    rating: currentHotel.rating,
    checkIn: checkIn,
    checkOut: checkOut,
    guests: guests,
    roomType: roomType,
    mealOption: selectedMeal ? selectedMeal.name : "Room Only",
    mealPrice: selectedMeal ? selectedMeal.price : 0
  });

  // If a meal option is selected and has a price, add it as a separate meal item
  if (selectedMeal && selectedMeal.price > 0) {
    // calculate nights
    let nights = 1;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (nights < 1) nights = 1;
    }

    // total meal cost = per-person price * guests * nights
    const mealTotal = (selectedMeal.price || 0) * guests * nights;

    const mealId = `${currentHotel.id}-meal-${selectedMeal.id}`;

    cart.addMeal({
      id: mealId,
      name: `${selectedMeal.name} (${currentHotel.name})`,
      price: mealTotal,
      quantity: 1,
      image: currentHotel.image || '',
      notes: `${guests} guest${guests > 1 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''} @ $${selectedMeal.price} per guest/night`
    });
  }
}

// Helper function to navigate to hotel details page
function viewHotelDetails(hotelId) {
  window.location.href = `hotelDetails.html?hotel=${hotelId}`;
}
// Hotel Search Functionality
// Add this script to your home.html before the closing </body> tag

// Hotel data
const hotels = [
  {
    id: "nile-luxury",
    name: "Nile Luxury Resort",
    location: "Cairo, Egypt",
    price: 1200,
    rating: 5,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    roomTypes: ["Standard Room", "Deluxe Room", "Suite"],
    maxGuests: 4,
  },
  {
    id: "red-sea",
    name: "Red Sea Paradise",
    location: "Hurghada, Red Sea",
    price: 900,
    rating: 4,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    roomTypes: ["Standard Room", "Deluxe Room", "Family Room"],
    maxGuests: 5,
  },
  {
    id: "alexandria-bay",
    name: "Alexandria Bay Hotel",
    location: "Alexandria, Mediterranean",
    price: 750,
    rating: 4,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    roomTypes: ["Standard Room", "Suite"],
    maxGuests: 3,
  },
  {
    id: "aswan-oasis",
    name: "Aswan Oasis Retreat",
    location: "Aswan, Upper Egypt",
    price: 850,
    rating: 5,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    roomTypes: ["Standard Room", "Deluxe Room", "Suite"],
    maxGuests: 4,
  },
  {
    id: "luxor-valley",
    name: "Luxor Valley Resort",
    location: "Luxor, Upper Egypt",
    price: 1100,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    roomTypes: ["Standard Room", "Deluxe Room", "Suite", "Family Room"],
    maxGuests: 6,
  },
  {
    id: "sharm-paradise",
    name: "Sharm Paradise Beach",
    location: "Sharm El Sheikh, Sinai",
    price: 950,
    rating: 4,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
    roomTypes: ["Standard Room", "Deluxe Room", "Suite"],
    maxGuests: 4,
  },
];

// Initialize search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector("form");

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      performSearch();
    });
  }
});

// Perform search
function performSearch() {
  // Get search criteria
  const guests = parseInt(document.querySelector("select").value) || 1;
  const checkIn = document.querySelectorAll('input[type="date"]')[0].value;
  const checkOut = document.querySelectorAll('input[type="date"]')[1].value;
  const roomType = document.querySelectorAll("select")[1].value;

  // Validate dates
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date");
      return;
    }
  }

  // Filter hotels
  let filteredHotels = hotels.filter((hotel) => {
    // Filter by guests
    const guestsMatch = hotel.maxGuests >= guests;

    // Filter by room type
    const roomTypeMatch = !roomType || hotel.roomTypes.includes(roomType);

    return guestsMatch && roomTypeMatch;
  });

  // Display results
  displaySearchResults(filteredHotels, { guests, checkIn, checkOut, roomType });
}

// Display search results
function displaySearchResults(filteredHotels, searchCriteria) {
  const hotelsGrid = document.querySelector(
    ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
  );

  if (!hotelsGrid) return;

  // Show search info
  const searchInfo = document.createElement("div");
  searchInfo.className =
    "col-span-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4";
  searchInfo.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-bold text-gray-900">Search Results</h3>
        <p class="text-sm text-gray-600">Found ${filteredHotels.length} hotel(s) matching your criteria</p>
      </div>
      <button onclick="clearSearch()" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
        <i class="fas fa-times mr-1"></i>Clear Search
      </button>
    </div>
  `;

  // Clear existing results
  hotelsGrid.innerHTML = "";
  hotelsGrid.prepend(searchInfo);

  // Display filtered hotels
  if (filteredHotels.length === 0) {
    hotelsGrid.innerHTML += `
      <div class="col-span-full text-center py-12">
        <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your search criteria</p>
        <button onclick="clearSearch()" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          View All Hotels
        </button>
      </div>
    `;
    return;
  }

  filteredHotels.forEach((hotel) => {
    const hotelCard = createHotelCard(hotel, searchCriteria);
    hotelsGrid.innerHTML += hotelCard;
  });

  // Scroll to results
  hotelsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Create hotel card HTML
function createHotelCard(hotel, searchCriteria) {
  const stars = generateStars(hotel.rating);
  const nights = calculateNights(
    searchCriteria.checkIn,
    searchCriteria.checkOut
  );
  const totalPrice = hotel.price * nights;

  return `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <img src="${hotel.image}" alt="${
    hotel.name
  }" class="w-full h-56 object-cover" />
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-gray-900">${hotel.name}</h3>
          <div class="flex items-center">
            ${stars}
          </div>
        </div>
        <div class="flex items-center text-gray-600 mb-4">
          <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>
          <span>${hotel.location}</span>
        </div>
        <p class="text-gray-600 mb-4">
          ${getHotelDescription(hotel.id)}
        </p>
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-3xl font-bold text-blue-600">$${
              hotel.price
            }</span>
            <span class="text-sm text-gray-500">/night</span>
            ${
              nights > 1
                ? `<p class="text-sm text-gray-600">$${totalPrice.toLocaleString()} for ${nights} nights</p>`
                : ""
            }
          </div>
        </div>
        <div class="flex space-x-2">
          <a href="${getHotelDetailsLink(hotel.id)}" 
             class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-center">
            See Details
          </a>
          <button onclick="addToCart('${hotel.id}', '${hotel.name}', '${
    hotel.location
  }', ${hotel.price}, '${hotel.image}', ${hotel.rating})"
                  class="bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `;
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

// Calculate nights between dates
function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
}

// Get hotel description
function getHotelDescription(hotelId) {
  const descriptions = {
    "nile-luxury":
      "Experience luxury on the banks of the Nile with stunning views of the pyramids.",
    "red-sea":
      "Beachfront resort with world-class diving and crystal clear waters.",
    "alexandria-bay":
      "Modern hotel overlooking the Mediterranean with rich historical surroundings.",
    "aswan-oasis":
      "Boutique hotel near ancient temples with Nile views and traditional hospitality.",
    "luxor-valley":
      "Elegant resort steps away from the Valley of Kings and ancient wonders.",
    "sharm-paradise":
      "All-inclusive beach resort with spectacular coral reefs and desert adventures.",
  };
  return (
    descriptions[hotelId] || "Luxury accommodation with excellent amenities."
  );
}

// Get hotel details link
function getHotelDetailsLink(hotelId) {
  return `hotelDetails.html?hotel=${hotelId}`;
}

// Clear search and show all hotels
function clearSearch() {
  location.reload();
}

// Search by location (helper function)
function searchByLocation(location) {
  const filteredHotels = hotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(location.toLowerCase())
  );
  displaySearchResults(filteredHotels, {});
}

// Search by price range (helper function)
function searchByPriceRange(minPrice, maxPrice) {
  const filteredHotels = hotels.filter(
    (hotel) => hotel.price >= minPrice && hotel.price <= maxPrice
  );
  displaySearchResults(filteredHotels, {});
}

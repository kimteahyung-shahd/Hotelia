// Hotel Search Functionality with API Integration
// const API_URL = 'http://localhost:3001';

// Initialize search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector("form");
  
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      performSearch();
    });
  }

  // Set minimum dates to today
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  dateInputs.forEach(input => {
    input.min = today;
  });
});

// Perform search with API integration
async function performSearch() {
  try {
    // Get search criteria
    const guestsSelect = document.querySelector("select");
    const guests = guestsSelect ? parseInt(guestsSelect.value) || 1 : 1;
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const checkIn = dateInputs[0] ? dateInputs[0].value : '';
    const checkOut = dateInputs[1] ? dateInputs[1].value : '';
    
    const selectInputs = document.querySelectorAll("select");
    const roomTypeSelect = selectInputs[1];
    const roomType = roomTypeSelect ? roomTypeSelect.value : '';

    // Validate dates
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        alert("Check-in date cannot be in the past");
        return;
      }

      if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after check-in date");
        return;
      }

      // Calculate nights
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      if (nights > 365) {
        alert("Maximum stay is 365 nights");
        return;
      }
    } else if (checkIn || checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    // Fetch hotels from API
    const response = await fetch(`${API_URL}/hotels`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    
    const hotels = await response.json();
    
    // Filter hotels based on search criteria
    let filteredHotels = hotels.filter((hotel) => {
      // Filter by guests capacity
      let guestsMatch = true;
      if (guests > 0 && hotel.rooms && hotel.rooms.length > 0) {
        guestsMatch = hotel.rooms.some(room => room.guests >= guests);
      }

      // Filter by room type (search in room names)
      let roomTypeMatch = true;
      if (roomType && roomType !== '' && roomType !== 'Any' && hotel.rooms && hotel.rooms.length > 0) {
        roomTypeMatch = hotel.rooms.some(room => 
          room.name.toLowerCase().includes(roomType.toLowerCase())
        );
      }

      return guestsMatch && roomTypeMatch;
    });

    // Display results
    displaySearchResults(filteredHotels, { guests, checkIn, checkOut, roomType });

  } catch (error) {
    console.error('Search error:', error);
    alert('Failed to search hotels. Please try again.');
  }
}

// Display search results
function displaySearchResults(filteredHotels, searchCriteria) {
  const hotelsGrid = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3");

  if (!hotelsGrid) {
    console.error('Hotels grid not found');
    return;
  }

  // Show search info banner
  const existingSearchInfo = document.getElementById('search-info-banner');
  if (existingSearchInfo) {
    existingSearchInfo.remove();
  }

  const searchInfo = document.createElement("div");
  searchInfo.id = "search-info-banner";
  searchInfo.className = "col-span-full bg-blue-50 border border-[#0047AB] rounded-lg p-4 mb-4";
  
  let searchDetails = [];
  if (searchCriteria.guests) searchDetails.push(`${searchCriteria.guests} guest(s)`);
  if (searchCriteria.checkIn && searchCriteria.checkOut) {
    const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);
    searchDetails.push(`${nights} night(s)`);
  }
  if (searchCriteria.roomType && searchCriteria.roomType !== 'Any') {
    searchDetails.push(`Room: ${searchCriteria.roomType}`);
  }

  searchInfo.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-bold text-gray-900 text-lg">
          <i class="fas fa-search mr-2 text-[#0047AB]"></i>Search Results
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          Found ${filteredHotels.length} hotel(s) matching your criteria
          ${searchDetails.length > 0 ? `: ${searchDetails.join(' • ')}` : ''}
        </p>
      </div>
      <button onclick="clearSearch()" class="text-[#0047AB] hover:text-[#0047AB] font-semibold text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
        <i class="fas fa-times"></i>
        Clear Search
      </button>
    </div>
  `;

  // Clear existing hotel cards (but keep other elements)
  const existingCards = hotelsGrid.querySelectorAll('.bg-white.rounded-lg.shadow-lg');
  existingCards.forEach(card => card.remove());

  // Insert search info at the beginning
  hotelsGrid.insertBefore(searchInfo, hotelsGrid.firstChild);

  // Display filtered hotels
  if (filteredHotels.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = "col-span-full text-center py-16 bg-white rounded-lg shadow-sm";
    noResults.innerHTML = `
      <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your search criteria</p>
      <button onclick="clearSearch()" class="bg-[#0047AB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">
        <i class="fas fa-refresh mr-2"></i>View All Hotels
      </button>
    `;
    hotelsGrid.appendChild(noResults);
    return;
  }

  // Create and append hotel cards
  filteredHotels.forEach((hotel) => {
    const hotelCard = createHotelCard(hotel, searchCriteria);
    hotelsGrid.insertAdjacentHTML('beforeend', hotelCard);
  });

  // Scroll to results
  hotelsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Create hotel card HTML
function createHotelCard(hotel, searchCriteria) {
  const stars = generateStars(hotel.rating);
  const nights = calculateNights(searchCriteria.checkIn, searchCriteria.checkOut);
  
  // Find the cheapest room that matches guest criteria
  let displayPrice = hotel.price;
  let roomInfo = '';
  
  if (hotel.rooms && hotel.rooms.length > 0) {
    const matchingRooms = hotel.rooms.filter(room => 
      !searchCriteria.guests || room.guests >= searchCriteria.guests
    );
    
    if (matchingRooms.length > 0) {
      const cheapestRoom = matchingRooms.reduce((min, room) => 
        room.price < min.price ? room : min
      );
      displayPrice = cheapestRoom.price;
      roomInfo = `<p class="text-xs text-gray-500 mt-1">Starting from ${cheapestRoom.name}</p>`;
    }
  }
  
  const totalPrice = displayPrice * nights;

  return `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
      <div class="relative">
        <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-56 object-cover" />
        <div class="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
          <div class="flex items-center gap-1">
            <i class="fas fa-star text-yellow-400 text-sm"></i>
            <span class="font-bold text-gray-900 text-sm">${hotel.rating}</span>
          </div>
        </div>
        ${hotel.rooms && hotel.rooms.length > 0 ? 
          `<div class="absolute bottom-3 left-3 bg-[#0047AB] text-white px-3 py-1 rounded-full text-xs font-semibold">
            ${hotel.rooms.length} Room Type${hotel.rooms.length > 1 ? 's' : ''}
          </div>` : ''
        }
      </div>
      <div class="p-6">
        <div class="mb-3">
          <h3 class="text-xl font-bold text-gray-900 mb-2">${hotel.name}</h3>
          <div class="flex items-center text-gray-600 text-sm">
            <i class="fas fa-map-marker-alt mr-2 text-[#0047AB]"></i>
            <span>${hotel.location}</span>
          </div>
          <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
            ${stars}
            <span>(${hotel.reviews || 0} reviews)</span>
          </div>
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          ${hotel.description || 'Luxury accommodation with excellent amenities.'}
        </p>
        
        <div class="border-t pt-4 mb-4">
          <div class="flex items-end justify-between">
            <div>
              <span class="text-3xl font-bold text-[#0047AB]">$${displayPrice.toLocaleString()}</span>
              <span class="text-sm text-gray-500">/night</span>
              ${roomInfo}
            </div>
            ${nights > 1 ? 
              `<div class="text-right">
                <p class="text-xs text-gray-500">Total for ${nights} nights</p>
                <p class="text-lg font-bold text-gray-900">$${totalPrice.toLocaleString()}</p>
              </div>` : ''
            }
          </div>
        </div>
        
        <div class="flex gap-2">
          <a href="hotelDetails.html?hotel=${hotel.id}" 
             class="flex-1 bg-[#0047AB] text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-center text-sm">
            <i class="fas fa-info-circle mr-2"></i>View Details
          </a>
          <button onclick="quickAddToCart('${hotel.id}')"
                  class="bg-[#0047AB] text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition">
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
    stars += '<i class="fas fa-star text-yellow-400 text-xs"></i>';
  }
  if (hasHalf) {
    stars += '<i class="fas fa-star-half-alt text-yellow-400 text-xs"></i>';
  }
  for (let i = Math.ceil(rating); i < 5; i++) {
    stars += '<i class="far fa-star text-yellow-400 text-xs"></i>';
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

// Clear search and show all hotels
function clearSearch() {
  // Clear form inputs
  const form = document.querySelector("form");
  if (form) {
    form.reset();
  }
  
  // Remove search banner
  const searchBanner = document.getElementById('search-info-banner');
  if (searchBanner) {
    searchBanner.remove();
  }
  
  // Reload page to show all hotels
  location.reload();
}

// Quick add to cart function
async function quickAddToCart(hotelId) {
  try {
    const response = await fetch(`${API_URL}/hotels/${hotelId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel details');
    }
    
    const hotel = await response.json();
    
    // Get search criteria if available
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const checkIn = dateInputs[0]?.value || '';
    const checkOut = dateInputs[1]?.value || '';
    const guestsSelect = document.querySelector("select");
    const guests = guestsSelect ? parseInt(guestsSelect.value) || 2 : 2;
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first');
      return;
    }
    
    // Get the first available room or use hotel price
    let roomType = 'Standard Room';
    let roomPrice = hotel.price;
    
    if (hotel.rooms && hotel.rooms.length > 0) {
      roomType = hotel.rooms[0].name;
      roomPrice = hotel.rooms[0].price;
    }
    
    // Add to cart
    if (typeof cart !== 'undefined' && cart.addItem) {
      cart.addItem({
        id: hotel.id,
        name: hotel.name,
        location: hotel.shortLocation || hotel.location,
        price: roomPrice,
        image: hotel.image,
        rating: hotel.rating,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        roomType: roomType,
        mealOption: "Room Only",
        mealPrice: 0
      });
    } else {
      alert('Cart system not available. Please try from the details page.');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Failed to add hotel to cart. Please try again.');
  }
}

// Search by location (helper function)
async function searchByLocation(location) {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    const hotels = await response.json();
    
    const filteredHotels = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(location.toLowerCase()) ||
      hotel.shortLocation?.toLowerCase().includes(location.toLowerCase())
    );
    
    displaySearchResults(filteredHotels, { location });
  } catch (error) {
    console.error('Location search error:', error);
  }
}

// Search by price range (helper function)
async function searchByPriceRange(minPrice, maxPrice) {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    const hotels = await response.json();
    
    const filteredHotels = hotels.filter((hotel) => {
      let hotelPrice = hotel.price;
      
      // Check room prices if available
      if (hotel.rooms && hotel.rooms.length > 0) {
        const prices = hotel.rooms.map(room => room.price);
        hotelPrice = Math.min(...prices);
      }
      
      return hotelPrice >= minPrice && hotelPrice <= maxPrice;
    });
    
    displaySearchResults(filteredHotels, { minPrice, maxPrice });
  } catch (error) {
    console.error('Price range search error:', error);
  }
}

// Search by rating (helper function)
async function searchByRating(minRating) {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    const hotels = await response.json();
    
    const filteredHotels = hotels.filter((hotel) => hotel.rating >= minRating);
    
    displaySearchResults(filteredHotels, { minRating });
  } catch (error) {
    console.error('Rating search error:', error);
  }
}

// Advanced search with multiple filters
async function advancedSearch(filters) {
  try {
    const response = await fetch(`${API_URL}/hotels`);
    const hotels = await response.json();
    
    const filteredHotels = hotels.filter((hotel) => {
      let match = true;
      
      // Filter by location
      if (filters.location) {
        match = match && (
          hotel.location.toLowerCase().includes(filters.location.toLowerCase()) ||
          hotel.shortLocation?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Filter by price range
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        let hotelPrice = hotel.price;
        if (hotel.rooms && hotel.rooms.length > 0) {
          hotelPrice = Math.min(...hotel.rooms.map(room => room.price));
        }
        if (filters.minPrice !== undefined) {
          match = match && hotelPrice >= filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          match = match && hotelPrice <= filters.maxPrice;
        }
      }
      
      // Filter by rating
      if (filters.minRating !== undefined) {
        match = match && hotel.rating >= filters.minRating;
      }
      
      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        if (hotel.amenities && hotel.amenities.length > 0) {
          const hotelAmenityNames = hotel.amenities.map(a => a.name.toLowerCase());
          match = match && filters.amenities.every(amenity => 
            hotelAmenityNames.some(name => name.includes(amenity.toLowerCase()))
          );
        } else {
          match = false;
        }
      }
      
      return match;
    });
    
    displaySearchResults(filteredHotels, filters);
  } catch (error) {
    console.error('Advanced search error:', error);
  }
}
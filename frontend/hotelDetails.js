    const API_URL = 'http://localhost:3001';
    let currentHotel = null;
    let selectedMeal = null;
    let selectedRoom = null;

    // Load hotel details on page load
    document.addEventListener("DOMContentLoaded", async function () {
      const urlParams = new URLSearchParams(window.location.search);
      const hotelId = urlParams.get("hotel");

      console.log('Hotel ID from URL:', hotelId);

      if (hotelId) {
        try {
          const response = await fetch(`${API_URL}/hotels/${hotelId}`);
          if (response.ok) {
            currentHotel = await response.json();
            console.log('Hotel loaded:', currentHotel);
            loadHotelDetails(currentHotel);
            setupDateListeners();
            setupMealButtons();
          } else {
            console.error('Failed to load hotel');
            showError();
          }
        } catch (error) {
          console.error('Error loading hotel:', error);
          showError();
        }
      } else {
        console.error('No hotel ID provided');
        window.location.href = "home.html";
      }
    });

    // Show error message
    function showError() {
      const container = document.getElementById('hotelContainer');
      container.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-circle text-4xl text-red-600"></i>
          <p class="mt-4 text-gray-600">Error loading hotel details</p>
          <a href="home.html" class="mt-4 inline-block text-blue-600 hover:underline">Back to Hotels</a>
        </div>
      `;
    }

    // Load hotel details into page
    function loadHotelDetails(hotel) {
      const container = document.getElementById("hotelContainer");
      
      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Hotel Info -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Hotel Header -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-96 object-cover" />
              <div class="p-8">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">${hotel.name}</h1>
                    <p class="text-lg text-gray-600 flex items-center">
                      <i class="fas fa-map-marker-alt mr-2"></i>
                      ${hotel.location}
                    </p>
                  </div>
                  <div class="text-right">
                    <div class="flex items-center mb-2">
                      ${generateStars(hotel.rating)}
                      <span class="ml-2 text-base font-semibold">(${hotel.rating})</span>
                    </div>
                    <p class="text-xs text-gray-500">${hotel.reviews || 0} reviews</p>
                  </div>
                </div>
                
                <p class="text-gray-700 text-base leading-relaxed">${hotel.description}</p>
                
                <div class="mt-6 flex items-center">
                  <span class="text-2xl font-bold text-[#0047AB]">${hotel.price}</span>
                  <span class="text-gray-600 text-sm ml-2">per night</span>
                </div>
              </div>
            </div>

            <!-- Amenities Section -->
            ${hotel.amenities && hotel.amenities.length > 0 ? `
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                <i class="fas fa-star text-yellow-400 mr-2"></i>
                Hotel Amenities
              </h2>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${hotel.amenities.map(amenity => `
                  <div class="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:border-[#0047AB] hover:shadow-md transition">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#0047AB] to-[#003262]">
                      <i class="fas ${amenity.icon} text-white text-sm"></i>
                    </div>
                    <span class="text-gray-700 text-sm font-medium">${amenity.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Available Rooms Section -->
            ${hotel.rooms && hotel.rooms.length > 0 ? `
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                <i class="fas fa-bed text-[#0047AB] mr-2"></i>
                Available Rooms
              </h2>
              <div class="space-y-6">
                ${hotel.rooms.map((room, index) => `
                  <div class="border-2 rounded-lg p-6 hover:shadow-lg transition cursor-pointer" id="room-card-${index}">
                    <div class="flex flex-col md:flex-row gap-6">
                      <div class="relative flex-shrink-0">
                        <img src="${room.image}" alt="${room.name}" class="w-full md:w-64 h-48 object-cover rounded-lg" />
                        ${room.premium ? '<span class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Premium</span>' : ''}
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-start mb-3">
                          <div>
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${room.name}</h3>
                            <p class="text-sm text-gray-600">${room.description}</p>
                          </div>
                          <div class="text-right ml-4">
                            <p class="text-2xl font-bold text-[#0047AB]">${room.price}</p>
                            <p class="text-xs text-gray-500">per night</p>
                          </div>
                        </div>
                        <div class="flex flex-wrap gap-4 mb-4">
                          <span class="flex items-center text-sm text-gray-700">
                            <i class="fas fa-bed mr-2 text-[#0047AB]"></i> ${room.beds}
                          </span>
                          <span class="flex items-center text-sm text-gray-700">
                            <i class="fas fa-${room.guests > 1 ? "users" : "user"} mr-2 text-[#0047AB]"></i> ${room.guests} Guest${room.guests > 1 ? "s" : ""}
                          </span>
                          <span class="flex items-center text-sm text-gray-700">
                            <i class="fas fa-ruler-combined mr-2 text-[#0047AB]"></i> ${room.size}
                          </span>
                        </div>
                        <button onclick="selectRoom(${index}, '${room.name}', ${room.price})" class="bg-[#0047AB] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#003072] transition">
                          Select Room
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Meal Plans Section -->
            ${hotel.meals && hotel.meals.length > 0 ? `
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-xl font-bold text-gray-900 mb-6">
                <i class="fas fa-utensils text-[#0047AB] mr-2"></i>
                Meal Plans
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${hotel.meals.filter(m => m.available).map((meal, index) => `
                  <div class="border-2 rounded-lg p-5 hover:shadow-lg transition" id="meal-card-${index}">
                    <div class="flex items-start mb-4">
                      <div class="w-12 h-12 rounded-lg flex items-center justify-center mr-3 flex-shrink-0" style="background-color: ${meal.bgColor || '#F3F4F6'}">
                        <i class="fas ${meal.icon} text-xl" style="color: ${meal.color}"></i>
                      </div>
                      <div class="flex-1">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">${meal.name}</h3>
                        <p class="text-xs text-gray-600">${meal.subtitle}</p>
                      </div>
                    </div>
                    <div class="mb-4">
                      <span class="text-2xl font-bold" style="color: ${meal.color}">
                        ${meal.price > 0 ? `+${meal.price}` : 'Included'}
                      </span>
                      ${meal.price > 0 ? '<span class="text-xs text-gray-500 ml-1">/person/day</span>' : ''}
                    </div>
                    ${meal.features && meal.features.length > 0 ? `
                      <ul class="space-y-1.5 mb-5">
                        ${meal.features.map(feature => `
                          <li class="text-xs text-gray-700 flex items-start">
                            <i class="fas fa-check-circle mr-2 mt-0.5 flex-shrink-0 text-sm" style="color: ${meal.color}"></i>
                            <span>${feature}</span>
                          </li>
                        `).join('')}
                      </ul>
                    ` : ''}
                    <button onclick="selectMeal(${index}, '${meal.name}', ${meal.price}, '${meal.color}')" 
                      style="background-color: ${meal.color}"
                      class="w-full text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition">
                      Select
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Right Column - Booking Form -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 class="text-xl font-bold text-gray-900 mb-5">Book Your Stay</h3>
              <form class="space-y-4" onsubmit="return false;">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">
                    <i class="fas fa-calendar-check mr-1 text-[#0047AB]"></i>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">
                    <i class="fas fa-calendar-times mr-1 text-[#0047AB]"></i>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">
                    <i class="fas fa-users mr-1 text-[#0047AB]"></i>
                    Number of Guests
                  </label>
                  <select
                    id="numGuests"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>1 Guest</option>
                    <option selected>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-2">
                    <i class="fas fa-door-open mr-1 text-[#0047AB]"></i>
                    Selected Room
                  </label>
                  <input
                    type="text"
                    id="selectedRoomDisplay"
                    readonly
                    value="Please select a room"
                    class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>

                <div class="border-t pt-4 mt-5">
                  <div class="space-y-2.5">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600" id="nightsLabel">1 night</span>
                      <span class="text-sm text-gray-900 font-semibold" id="nightsPrice">$0</span>
                    </div>
                    <div id="mealCostRow"></div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-600">Service fee</span>
                      <span class="text-sm text-gray-900 font-semibold">$50</span>
                    </div>
                    <div class="flex justify-between items-center pt-2.5 border-t-2">
                      <span class="text-base font-bold text-gray-900">Total</span>
                      <span class="text-2xl font-bold text-[#0047AB]" id="totalPrice">$0</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onclick="addCurrentHotelToCart()"
                  class="w-full bg-[#0047AB] text-white py-3 text-sm rounded-lg font-semibold hover:bg-[#003262] transition transform hover:scale-105 shadow-lg"
                >
                  <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                </button>

                <p class="text-xs text-gray-500 text-center mt-3 flex items-center justify-center">
                  <i class="fas fa-shield-alt mr-1.5 text-green-500"></i>
                  Secure booking - You won't be charged yet
                </p>
              </form>          
            </div>
          </div>
        </div>
      `;

      calculateTotal();
    }

    // Generate star rating
    function generateStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 !== 0;
      let stars = '';
      for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
      }
      if (hasHalf) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
      }
      const emptyStars = 5 - Math.ceil(rating);
      for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-yellow-400"></i>';
      }
      return stars;
    }

    // Select a room
    function selectRoom(index, roomName, roomPrice) {
      selectedRoom = { name: roomName, price: roomPrice };
      
      // Update UI - reset all cards
      document.querySelectorAll('[id^="room-card-"]').forEach(card => {
        card.style.borderWidth = '2px';
        card.style.borderColor = '#E5E7EB';
        card.classList.remove('bg-blue-50');
      });
      
      // Highlight selected card
      const selectedCard = document.getElementById(`room-card-${index}`);
      if (selectedCard) {
        selectedCard.style.borderWidth = '3px';
        selectedCard.style.borderColor = '#0047AB';
        selectedCard.classList.add('bg-blue-50');
      }
      
      // Update display field
      document.getElementById('selectedRoomDisplay').value = roomName;
      
      // Recalculate total
      calculateTotal();
      
      // Smooth scroll to booking form
      document.querySelector('.sticky').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Select a meal
    function selectMeal(index, mealName, mealPrice, color) {
      selectedMeal = { name: mealName, price: mealPrice };
      
      // Update UI - reset all cards
      document.querySelectorAll('[id^="meal-card-"]').forEach(card => {
        card.style.borderWidth = '2px';
        card.style.borderColor = '#E5E7EB';
        const btn = card.querySelector('button');
        btn.textContent = 'Select';
      });
      
      // Highlight selected card
      const selectedCard = document.getElementById(`meal-card-${index}`);
      if (selectedCard) {
        selectedCard.style.borderWidth = '3px';
        selectedCard.style.borderColor = color;
        selectedCard.querySelector('button').textContent = 'Selected ✓';
      }
      
      // Recalculate total
      calculateTotal();
      
      // Smooth scroll to booking form
      document.querySelector('.sticky').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Setup meal buttons
    function setupMealButtons() {
      setTimeout(() => {
        const mealButtons = document.querySelectorAll('[id^="meal-card-"] button');
        mealButtons.forEach((button, index) => {
          button.addEventListener('click', function() {
            const card = this.closest('[id^="meal-card-"]');
            const cardIndex = card.id.replace('meal-card-', '');
            // Get meal data from the hotel object
            if (currentHotel && currentHotel.meals) {
              const meal = currentHotel.meals.filter(m => m.available)[cardIndex];
              if (meal) {
                selectMeal(cardIndex, meal.name, meal.price, meal.color);
              }
            }
          });
        });
      }, 100);
    }

    // Setup date listeners
    function setupDateListeners() {
      setTimeout(() => {
        const checkIn = document.getElementById("checkInDate");
        const checkOut = document.getElementById("checkOutDate");
        const guests = document.getElementById("numGuests");

        if (checkIn) checkIn.addEventListener("change", calculateTotal);
        if (checkOut) checkOut.addEventListener("change", calculateTotal);
        if (guests) guests.addEventListener("change", calculateTotal);

        const today = new Date().toISOString().split("T")[0];
        if (checkIn) checkIn.min = today;
        if (checkOut) checkOut.min = today;
      }, 100);
    }

    // Calculate total price
    function calculateTotal() {
      if (!currentHotel) return;

      const checkIn = document.getElementById("checkInDate")?.value;
      const checkOut = document.getElementById("checkOutDate")?.value;
      const guestsText = document.getElementById("numGuests")?.value || "2 Guests";
      const guests = parseInt(guestsText.split(" ")[0]) || 2;

      let nights = 1;
      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (nights < 1) nights = 1;
      }

      const roomPrice = selectedRoom ? selectedRoom.price : currentHotel.price;
      const roomSubtotal = roomPrice * nights;
      const serviceFee = 50;
      
      let mealCost = 0;
      if (selectedMeal && selectedMeal.price > 0) {
        mealCost = selectedMeal.price * guests * nights;
      }

      const total = roomSubtotal + serviceFee + mealCost;

      // Update displays
      const nightsLabel = document.getElementById("nightsLabel");
      const nightsPrice = document.getElementById("nightsPrice");
      const totalPrice = document.getElementById("totalPrice");
      const mealCostRow = document.getElementById("mealCostRow");
      
      if (nightsLabel) nightsLabel.textContent = `${nights} night${nights > 1 ? 's' : ''}`;
      if (nightsPrice) nightsPrice.textContent = `$${roomSubtotal.toLocaleString()}`;
      if (totalPrice) totalPrice.textContent = `$${total.toLocaleString()}`;
      
      // Update meal cost display
      if (mealCostRow) {
        if (selectedMeal && selectedMeal.price > 0) {
          mealCostRow.innerHTML = `
            <div class="flex justify-between items-center">
              <span class="text-gray-600 text-sm">${selectedMeal.name} (${guests} × ${nights})</span>
              <span class="text-gray-900 font-semibold">$${mealCost.toLocaleString()}</span>
            </div>
          `;
        } else {
          mealCostRow.innerHTML = '';
        }
      }
    }


    // Add to cart
    function addCurrentHotelToCart() {
      if (!currentHotel) {
        alert('Hotel data not loaded');
        return;
      }

      const checkIn = document.getElementById("checkInDate")?.value;
      const checkOut = document.getElementById("checkOutDate")?.value;
      const guestsText = document.getElementById("numGuests")?.value || "2 Guests";
      const guests = parseInt(guestsText.split(" ")[0]) || 2;

      if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates");
        return;
      }

      if (!selectedRoom) {
        alert("Please select a room type");
        return;
      }

      if (typeof cart !== 'undefined' && cart.addItem) {
        cart.addItem({
          id: currentHotel.id,
          name: currentHotel.name,
          location: currentHotel.shortLocation,
          price: selectedRoom.price,
          image: currentHotel.image,
          rating: currentHotel.rating,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: guests,
          roomType: selectedRoom.name,
          mealOption: selectedMeal ? selectedMeal.name : "Room Only",
          mealPrice: selectedMeal ? selectedMeal.price : 0
        });
      } else {
        alert('Cart system not loaded. Please refresh the page.');
      }
    }

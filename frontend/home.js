      const API_URL = 'http://localhost:3001';

      // Load hotels from database
      async function loadHotels() {
        try {
          const response = await fetch(`${API_URL}/hotels`);
          const hotels = await response.json();
          displayHotels(hotels);
        } catch (error) {
          console.error('Error loading hotels:', error);
          showErrorMessage();
        }
      }

      // Display hotels on the page
      function displayHotels(hotels) {
        const hotelsGrid = document.getElementById('hotelsGrid');
        
        hotelsGrid.innerHTML = hotels.map(hotel => `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <img
              src="${hotel.image}"
              alt="${hotel.name}"
              class="w-full h-56 object-cover"
            />
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-gray-900">${hotel.name}</h3>
                <div class="flex items-center">
                  ${generateStars(hotel.rating)}
                </div>
              </div>
              <div class="flex items-center text-gray-600 mb-4">
                <i class="fas fa-map-marker-alt mr-2 text-[#0047AB]"></i>
                <span>${hotel.shortLocation}</span>
              </div>
              <p class="text-gray-600 mb-4">${truncateText(hotel.description, 100)}</p>
              <div class="flex items-center justify-between mb-4">
                <span class="text-3xl font-bold text-[#0047AB]">
                  $${hotel.price}<span class="text-sm text-gray-500">/night</span>
                </span>
              </div>
              <div class="flex space-x-2">
                <button
                  onclick="viewHotelDetails('${hotel.id}')"
                  class="flex-1 bg-[#0047AB] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#003072] transition text-center"
                >
                  See Details
                </button>
                <a
                  href="#location"
                  class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  <i class="fas fa-map-marker-alt"></i>
                </a>
              </div>
            </div>
          </div>
        `).join('');
      }

      // Navigate to hotel details
      function viewHotelDetails(hotelId) {
        console.log('Navigating to hotel details:', hotelId);
        window.location.href = `hotelDetails.html?hotel=${hotelId}`;
      }

      // Generate star rating HTML
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

      // Truncate text to specified length
      function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
      }

      // Show error message if hotels fail to load
      function showErrorMessage() {
        const hotelsGrid = document.getElementById('hotelsGrid');
        
        hotelsGrid.innerHTML = `
          <div class="col-span-full text-center py-12">
            <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Unable to Load Hotels</h3>
            <p class="text-gray-600 mb-4">Please check your connection and try again.</p>
            <button onclick="loadHotels()" class="bg-[#0047AB] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003072] transition">
              <i class="fas fa-sync-alt mr-2"></i>Retry
            </button>
          </div>
        `;
      }

      // Load hotels when page loads
      document.addEventListener('DOMContentLoaded', () => {
        loadHotels();
      });

      // Date validation
      document.addEventListener("DOMContentLoaded", function () {
        const checkInInput = document.querySelectorAll('input[type="date"]')[0];
        const checkOutInput = document.querySelectorAll('input[type="date"]')[1];

        const today = new Date().toISOString().split("T")[0];
        checkInInput.min = today;
        checkOutInput.min = today;

        checkInInput.addEventListener("change", function () {
          const checkInDate = this.value;
          if (checkInDate) {
            const checkInDateObj = new Date(checkInDate);
            checkInDateObj.setDate(checkInDateObj.getDate() + 1);
            const minCheckOut = checkInDateObj.toISOString().split("T")[0];
            checkOutInput.min = minCheckOut;

            if (checkOutInput.value && checkOutInput.value <= checkInDate) {
              checkOutInput.value = "";
              alert("Check-out date must be after check-in date.");
            }
          }
        });

        checkOutInput.addEventListener("change", function () {
          const checkInDate = checkInInput.value;
          const checkOutDate = this.value;

          if (checkInDate && checkOutDate) {
            if (checkOutDate <= checkInDate) {
              this.value = "";
              alert("Check-out date must be after check-in date.");
            }
          }
        });
      });

      // Search form submission
      const searchForm = document.getElementById('searchForm');
      if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const guests = document.querySelectorAll('select')[0].value;
          const checkIn = document.querySelectorAll('input[type="date"]')[0].value;
          const checkOut = document.querySelectorAll('input[type="date"]')[1].value;
          const roomType = document.querySelectorAll('select')[1].value;
          
          if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates');
            return;
          }
          
          if (checkOut <= checkIn) {
            alert('Check-out date must be after check-in date');
            return;
          }
          
          localStorage.setItem('searchCriteria', JSON.stringify({
            guests,
            checkIn,
            checkOut,
            roomType
          }));
          
          // window.location.href = 'hotels.html';
        });
      }

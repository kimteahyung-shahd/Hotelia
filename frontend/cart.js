// Cart Management System
const cart = {
  items: [],

  // Initialize cart from localStorage
  init() {
    const savedCart = localStorage.getItem("hotelCart");
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart) || [];
      } catch (e) {
        this.items = [];
      }

      // Normalize loaded items to ensure numeric fields are numbers
      this.items = this.items.map((it) => {
        const item = Object.assign({}, it);
        item.type = item.type || 'hotel';
        item.price = parseFloat(item.price) || 0;
        if (item.type === 'meal') {
          item.quantity = parseInt(item.quantity) || 1;
        }
        if (item.type === 'hotel') {
          item.guests = parseInt(item.guests) || 1;
        }
        return item;
      });
    }
    this.updateCartCount();
  },

  // Add item to cart
  // Add item to cart (hotel or generic item). For hotels, pass type: 'hotel'.
  addItem(item) {
    const existingItem = this.items.find((i) => i.id === item.id && i.type === (item.type || 'hotel'));

    if (existingItem) {
      alert(item.type === 'meal' ? "This meal is already in your cart!" : "This hotel is already in your cart!");
      return;
    }

    if ((item.type || 'hotel') === 'hotel') {
      this.items.push({
        id: item.id,
        type: 'hotel',
        name: item.name,
        location: item.location,
        price: parseFloat(item.price) || 0,
        image: item.image,
        rating: item.rating,
        checkIn: item.checkIn || "",
        checkOut: item.checkOut || "",
        guests: item.guests || 1,
        roomType: item.roomType || "Standard Room",
      });
      this.save();
      this.updateCartCount();
      this.showNotification("Hotel added to cart!");
      return;
    }

    // For any other generic type, push as-is but coerce numeric fields
    const safeItem = Object.assign({ type: item.type || 'item' }, item);
    safeItem.price = parseFloat(safeItem.price) || 0;
    if (safeItem.quantity) safeItem.quantity = parseInt(safeItem.quantity) || safeItem.quantity;
    this.items.push(safeItem);
    this.save();
    this.updateCartCount();
    this.showNotification("Item added to cart!");
  },

  // Convenience: add a meal to the cart
  addMeal(meal) {
    const existingMeal = this.items.find((i) => i.id === meal.id && i.type === 'meal');
    if (existingMeal) {
      // If meal already exists, increase quantity (coerce to numbers)
      existingMeal.quantity = (existingMeal.quantity || 1) + (parseInt(meal.quantity) || 1);
      this.save();
      this.updateCartCount();
      this.showNotification("Meal quantity updated in cart!");
      return;
    }

    this.items.push({
      id: meal.id,
      type: 'meal',
      name: meal.name,
      price: parseFloat(meal.price) || 0,
      image: meal.image || meal.img || '',
      quantity: parseInt(meal.quantity) || 1,
      notes: meal.notes || '',
    });

    this.save();
    this.updateCartCount();
    this.showNotification("Meal added to cart!");
  },

  // Remove item from cart
  removeItem(itemId, itemType) {
    if (itemType) {
      this.items = this.items.filter((item) => !(item.id === itemId && item.type === itemType));
    } else {
      this.items = this.items.filter((item) => item.id !== itemId);
    }
    this.save();
    this.updateCartCount();
    this.renderCart();
  },

  // Update item details
  updateItem(itemId, updates, itemType) {
    let item;
    if (itemType) {
      item = this.items.find((i) => i.id === itemId && i.type === itemType);
    } else {
      item = this.items.find((i) => i.id === itemId);
    }

    if (item) {
      // Coerce numeric updates to proper types
      if (updates.price !== undefined) updates.price = parseFloat(updates.price) || 0;
      if (updates.quantity !== undefined) updates.quantity = parseInt(updates.quantity) || 0;
      if (updates.guests !== undefined) updates.guests = parseInt(updates.guests) || item.guests || 1;
      Object.assign(item, updates);
      this.save();
      this.renderCart();
    }
  },

  // Calculate total
  getTotal() {
    return this.items.reduce((total, item) => {
      if (item.type === 'hotel') {
        const nights = this.calculateNights(item.checkIn, item.checkOut);
        return total + item.price * nights;
      }
      if (item.type === 'meal') {
        return total + item.price * (item.quantity || 1);
      }
      // generic item
      return total + (item.price || 0) * (item.quantity || 1);
    }, 0);
  },

  // Calculate nights
  calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  },

  // Save to localStorage
  save() {
    localStorage.setItem("hotelCart", JSON.stringify(this.items));
  },

  // Update cart count in navigation
  updateCartCount() {
    const cartBadge = document.getElementById("cartCount");
    if (cartBadge) {
      const count = this.items.reduce((sum, i) => sum + (i.type === 'meal' ? (i.quantity || 1) : 1), 0);
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? "flex" : "none";
    }
  },

  // Show notification
  showNotification(message) {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in";
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-check-circle mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  },

  // Render cart page
  renderCart() {
    const cartContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");

    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = `
        <div class="text-center py-16">
          <i class="fas fa-shopping-cart text-gray-300 text-6xl mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p class="text-gray-600 mb-6">Start adding hotels to your cart to book your perfect stay!</p>
          <a href="home.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Browse Hotels
          </a>
        </div>
      `;
      if (cartSummary) cartSummary.innerHTML = "";
      return;
    }

    // Render cart items (hotels and meals)
    cartContainer.innerHTML = this.items
      .map((item) => {
        if (item.type === 'meal') {
          const mealTotal = (item.price || 0) * (item.quantity || 1);
          // If item.price was saved as a total (quantity=1), show as total; otherwise show per-unit
          const priceLabel = (item.quantity && item.quantity > 1)
            ? `$${((item.price || 0) / (item.quantity || 1)).toFixed(2)} each`
            : `Price: $${(item.price || 0).toLocaleString()}`;
          return `
          <div class="bg-white rounded-lg shadow-lg p-6 mb-4" data-item-id="${item.id}" data-item-type="meal">
            <div class="flex items-center gap-6">
                  <i class="fas fa-utensils text-[#003262] text-3xl"></i>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">${item.name}</h3>
                    <p class="text-sm text-gray-600 mt-1">${item.notes || ''}</p>
                  </div>
                  <button onclick="cart.removeItem('${item.id}','meal')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash-alt text-xl"></i>
                  </button>
                </div>

                <div>
                  <div class="text-right flex flex-col items-end justify-center">
                    <div class="text-sm text-gray-600">${priceLabel}</div>
                    <div class="text-2xl font-bold text-[#003262]">$${mealTotal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        }

        // default: hotel
        const nights = this.calculateNights(item.checkIn, item.checkOut);
        const itemTotal = (item.price || 0) * nights;

        return `
        <div class="bg-white rounded-lg shadow-lg p-6 mb-4" data-item-id="${item.id}" data-item-type="hotel">
          <div class="flex flex-col md:flex-row gap-6">
            <img src="${item.image}" alt="${item.name}" class="w-full md:w-48 h-32 object-cover rounded-lg">
            
            <div class="flex-1">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">${item.name}</h3>
                  <div class="flex items-center text-gray-600 mt-1">
                    <i class="fas fa-map-marker-alt mr-2 text-[#003262]"></i>
                    <span>${item.location}</span>
                  </div>
                  <div class="flex items-center mt-2">
                    ${this.renderStars(item.rating)}
                  </div>
                </div>
                <button onclick="cart.removeItem('${item.id}','hotel')" class="text-red-500 hover:text-red-700">
                  <i class="fas fa-trash-alt text-xl"></i>
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                  <input type="date" value="${item.checkIn}" 
                    onchange="cart.updateItem('${item.id}', {checkIn: this.value}, 'hotel')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                  <input type="date" value="${item.checkOut}"
                    onchange="cart.updateItem('${item.id}', {checkOut: this.value}, 'hotel')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <select value="${item.guests}"
                    onchange="cart.updateItem('${item.id}', {guests: parseInt(this.value)}, 'hotel')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="1" ${item.guests === 1 ? "selected" : ""}>1 Guest</option>
                    <option value="2" ${item.guests === 2 ? "selected" : ""}>2 Guests</option>
                    <option value="3" ${item.guests === 3 ? "selected" : ""}>3 Guests</option>
                    <option value="4" ${item.guests === 4 ? "selected" : ""}>4+ Guests</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <input type="text" value="${item.roomType}" readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                </div>
              </div>
              
              <div class="flex justify-between items-center pt-4 border-t">
                <div>
                  <span class="text-sm text-gray-600">${nights} night${nights > 1 ? "s" : ""} × $${item.price}</span>
                </div>
                <div class="text-right">
                  <span class="text-2xl font-bold text-[#003262]">$${itemTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    // Render summary
    if (cartSummary) {
      const subtotal = this.getTotal();
      const hotelCount = this.items.filter(i => i.type === 'hotel').length;
      const totalItems = this.items.length;
      const serviceFee = hotelCount * 50; // service fee applies per hotel booking
      const total = subtotal + serviceFee;

      cartSummary.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 sticky top-24">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h3>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal (${totalItems} item${totalItems > 1 ? 's' : ''})</span>
              <span class="font-semibold">$${subtotal.toLocaleString()}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span class="font-semibold">$${serviceFee}</span>
            </div>
            <div class="border-t pt-3 flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">Total</span>
              <span class="text-2xl font-bold text-[#003262]">$${total.toLocaleString()}</span>
            </div>
          </div>

          <a href="checkout.html" class="block w-full bg-[#0047AB] text-white py-3 rounded-lg font-semibold hover:bg-[#003262] transition text-center">
            <i class="fas fa-credit-card mr-2"></i>Proceed to Checkout
          </a>

          <p class="text-xs text-gray-500 text-center mt-4">
            <i class="fas fa-shield-alt mr-1"></i>
            Secure booking - SSL encrypted
          </p>
        </div>
      `;
    }
  },

  // Render star rating
  renderStars(rating) {
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
  },

  // Clear cart
  clear() {
    this.items = [];
    this.save();
    this.updateCartCount();
    this.renderCart();
  },
};

// Initialize cart when page loads
document.addEventListener("DOMContentLoaded", () => {
  cart.init();

  // If on cart page, render cart
  if (document.getElementById("cartItems")) {
    cart.renderCart();
  }
});

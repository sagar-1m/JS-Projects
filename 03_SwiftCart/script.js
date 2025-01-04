document.addEventListener("DOMContentLoaded", () => {
  // Array of products with ID, name, and price properties  that will be displayed to the user
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 29.99,
    },
    {
      id: 2,
      name: "Product 2",
      price: 39.99,
    },
    {
      id: 3,
      name: "Product 3",
      price: 49.99,
    },
  ];
  const cart = []; // Array to store the products added to the cart by the user

  // Get the elements from the DOM  that will be used to display the products, cart items, and total price to the user
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");

  // Loop through the products array and create a product div for each product  with the product name, price, and an "Add to cart" button that has a data-id attribute with the product ID  to identify the product when the user clicks the button
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <span>${product.name} - $${product.price.toFixed(2)}</span>
      <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
    `;
    productList.appendChild(productDiv);
  });

  // Add an event listener to the product list to handle the "Add to cart" button click event and add the product to the cart when the user clicks the button
  productList.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
      const productId = parseInt(event.target.getAttribute("data-id")); // Get the product ID from the data-id attribute of the button  that was clicked  by the user
      const product = products.find((product) => product.id === productId); // Find the product with the matching ID in the products array  and store it in a variable  called product  if it exists
      addToCart(product); // Call the addToCart function with the product as an argument  to add the product to the cart
    }
  });

  // Function to add a product to the cart array and update the cart display  with the new item added
  function addToCart(product) {
    cart.push(product); // Add the product to the cart array
    renderCart(); // Call the updateCart function to update the cart display
  }

  // Function to update the cart display with the items in the cart array and the total price of the items  in the cart array and display it to the user  and also handle the "Remove" button click event to remove an item from the cart   and update the cart display with the item removed and update the total price and display it to the user

  function renderCart() {
    cartItems.innerHTML = ""; // Clear the cart items display

    let totalPrice = 0; // Initialize the total price to 0

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden"); // Hide the empty cart message
      cartTotalMessage.classList.remove("hidden"); // Show the cart total message
      cart.forEach((item, index) => {
        totalPrice += item.price; // Add the price of the item to the total price)
        const cartItem = document.createElement("div");
        cartItem.innerHTML = `${item.name} - $${item.price.toFixed(
          2
        )}  <button class="remove-from-cart" data-index="${index}">Remove</button>`;

        // add styling class to the cart item div element to style the remove button
        cartItem.classList.add("cart-item");

        cartItems.appendChild(cartItem);
        totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`; // Update the total price display  with the new total price
      });
    } else {
      emptyCartMessage.classList.remove("hidden"); // Show the empty cart message
      cartTotalMessage.classList.add("hidden"); // Hide the cart total message
    }
  }

  // Add an event listener to the cart items to handle the "Remove" button click event and remove the item from the cart when the user clicks the button  and update the cart display with the item removed and update the total price and display it to the user
  cartItems.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart")) {
      const index = parseInt(event.target.getAttribute("data-index")); // Get the index of the item to be removed from the data-index attribute of the button that was clicked by the user
      cart.splice(index, 1); // Remove the item from the cart array at the specified index
      renderCart(); // Call the updateCart function to update the cart display
    }
  });

  // Add an event listener to the checkout button to handle the checkout process
  checkOutBtn.addEventListener("click", () => {
    cart.length = 0; // Clear the cart array
    alert("Checkout complete!"); // Display an alert message when the user clicks the checkout button
    renderCart(); // Call the updateCart function to update the cart display
  });
});

// script.js
document.addEventListener('DOMContentLoaded', () => {
    class Product {
        constructor(id, name, price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }
    }

    class ShoppingCartItem {
        constructor(product, quantity = 1) {
            this.product = product;
            this.quantity = quantity;
        }

        getTotalPrice() {
            return this.product.price * this.quantity;
        }
    }

    class ShoppingCart {
        constructor() {
            this.items = [];
        }

        addItem(product) {
            const existingItem = this.items.find(item => item.product.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.items.push(new ShoppingCartItem(product));
            }
            this.displayCartItems();
        }

        removeItem(productId) {
            this.items = this.items.filter(item => item.product.id !== productId);
            this.displayCartItems();
        }

        updateItemQuantity(productId, quantity) {
            const item = this.items.find(item => item.product.id === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    this.removeItem(productId);
                } else {
                    this.displayCartItems();
                }
            }
        }

        getTotal() {
            return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
        }

        displayCartItems() {
            const cart = document.querySelector('.cart');
            cart.querySelectorAll('.cart-item').forEach(cartItem => cartItem.remove());

            this.items.forEach(cartItem => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.dataset.id = cartItem.product.id;
                itemDiv.dataset.price = cartItem.product.price;
                itemDiv.innerHTML = `
                    <span>${cartItem.product.name}</span>
                    <div class="item-controls">
                        <button class="decrement">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="increment">+</button>
                    </div>
                    <span class="price">$${cartItem.getTotalPrice()}</span>
                    <span class="heart">❤️</span>
                    <button class="delete">Delete</button>
                `;
                cart.appendChild(itemDiv);
            });

            this.updateTotalPrice();
        }

        updateTotalPrice() {
            const totalPriceElement = document.getElementById('total-price');
            totalPriceElement.textContent = this.getTotal();
        }
    }

    const shoppingCart = new ShoppingCart();

    document.querySelectorAll('.cart-item').forEach(cartItem => {
        const id = parseInt(cartItem.dataset.id);
        const name = cartItem.querySelector('span').textContent;
        const price = parseInt(cartItem.dataset.price);
        const product = new Product(id, name, price);
        shoppingCart.addItem(product);
    });

    document.querySelector('.cart').addEventListener('click', (e) => {
        const cartItem = e.target.closest('.cart-item');
        const productId = parseInt(cartItem.dataset.id);

        if (e.target.classList.contains('increment')) {
            shoppingCart.updateItemQuantity(productId, shoppingCart.items.find(item => item.product.id === productId).quantity + 1);
        }

        if (e.target.classList.contains('decrement')) {
            shoppingCart.updateItemQuantity(productId, shoppingCart.items.find(item => item.product.id === productId).quantity - 1);
        }

        if (e.target.classList.contains('delete')) {
            shoppingCart.removeItem(productId);
        }

        if (e.target.classList.contains('heart')) {
            e.target.classList.toggle('liked');
        }
    });

    shoppingCart.displayCartItems();
});

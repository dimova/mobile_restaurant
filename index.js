const app = document.getElementById('app');
let cart = {};
let currentView = 'menu';

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}

function getCartItems() {
    return menuArray.filter((item) => cart[item.id] > 0);
}

function getItemCount() {
    return getCartItems().reduce((count, item) => count + cart[item.id], 0);
}

function getTotal() {
    return getCartItems().reduce((total, item) => {
        return total + item.price * cart[item.id];
    }, 0);
}

function renderMenuView() {
    const items = getCartItems();
    const total = getTotal();
    const itemCount = getItemCount();

    return `
        <div class="phone-shell">
            <header class="topbar">
                <div class="app-brand">
                    <span class="brand-icon" aria-hidden="true">🍽️</span>
                    <h1 class="app-title">Mobile Restaurant Menu (Copy)</h1>
                </div>
                <button class="share-btn" type="button">Share</button>
            </header>

            <main class="menu-list">
                ${menuArray
                    .map((item) => `
                        <article class="menu-item" aria-label="${item.name} menu item">
                            <div class="food-emoji" aria-hidden="true">${item.emoji}</div>
                            <div class="menu-details">
                                <h2 class="menu-name">${item.name}</h2>
                                <p class="menu-ingredients">${item.ingredients.join(', ')}</p>
                                <div class="item-meta">
                                    <span class="price-tag">${formatCurrency(item.price)}</span>
                                    <button class="add-btn" type="button" aria-label="Add ${item.name} to order" data-id="${item.id}">+</button>
                                </div>
                            </div>
                        </article>
                    `)
                    .join('')}
            </main>

            <aside class="order-panel">
                <div class="order-header">
                    <h3>Your order</h3>
                    <span class="order-count">${itemCount} item${itemCount === 1 ? '' : 's'}</span>
                </div>

                ${items.length === 0 ? `
                    <div class="empty-state">
                        No items selected yet.<br />
                        Tap the + button to add a meal.
                    </div>
                ` : `
                    <div class="order-items">
                        ${items
                            .map((item) => `
                                <div class="order-item">
                                    <div class="item-summary">
                                        <span class="item-name">${item.name}</span>
                                        <span class="item-qty">x${cart[item.id]}</span>
                                    </div>
                                    <div class="item-actions">
                                        <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Remove one ${item.name}">-</button>
                                        <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Add one ${item.name}">+</button>
                                        <span class="item-price">${formatCurrency(item.price * cart[item.id])}</span>
                                    </div>
                                </div>
                            `)
                            .join('')}
                    </div>
                    <div class="total-row">
                        <span>Total</span>
                        <span>${formatCurrency(total)}</span>
                    </div>
                    <button class="order-btn" type="button">Place order</button>
                `}
            </aside>
        </div>
    `;
}

function renderCheckoutView() {
    const total = getTotal();

    return `
        <div class="payment-backdrop" aria-modal="true" role="dialog" aria-label="Checkout payment modal">
            <div class="payment-modal">
                <div class="modal-header">
                    <button class="close-modal" type="button" aria-label="Close checkout">×</button>
                    <h2>Payment</h2>
                    <div class="spacer"></div>
                </div>

                <div class="payment-summary">
                    <span>Order total</span>
                    <strong>${formatCurrency(total)}</strong>
                </div>

                <div class="payment-methods">
                    <button type="button" class="method-pill active">Card</button>
                    <button type="button" class="method-pill">Apple Pay</button>
                    <button type="button" class="method-pill">Cash</button>
                </div>

                <form class="payment-form" id="payment-form">
                    <label class="field">
                        <span>Cardholder name</span>
                        <input class="payment-input" type="text" value="Desislava Dimova" aria-label="Cardholder name" />
                    </label>

                    <label class="field">
                        <span>Card number</span>
                        <input class="payment-input" type="text" value="1234 5678 9012 3456" aria-label="Card number" />
                    </label>

                    <div class="mini-fields">
                        <label class="field">
                            <span>Exp.</span>
                            <input class="payment-input" type="text" value="10/29" aria-label="Expiration date" />
                        </label>
                        <label class="field">
                            <span>CVV</span>
                            <input class="payment-input" type="password" value="123" aria-label="CVV" />
                        </label>
                    </div>

                    <button class="pay-btn" type="submit">Pay ${formatCurrency(total)}</button>
                </form>
            </div>
        </div>
    `;
}

function renderCompleteView() {
    const total = getTotal();

    return `
        <div class="phone-shell complete-shell">
            <div class="success-container">
                <div class="success-icon" aria-hidden="true">✓</div>
                <p class="success-badge">Payment successful</p>
                <h2>Thank you!</h2>
                <p class="success-text">Your order is on the way.</p>
                <div class="success-total">
                    <span>Total</span>
                    <strong>${formatCurrency(total || 0)}</strong>
                </div>
                <button class="back-to-menu" type="button">Back to menu</button>
            </div>
        </div>
    `;
}

function render() {
    if (currentView === 'checkout') {
        app.innerHTML = renderCheckoutView();
        return;
    }

    if (currentView === 'complete') {
        app.innerHTML = renderCompleteView();
        return;
    }

    app.innerHTML = renderMenuView();
}

document.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-btn');
    if (addButton) {
        const itemId = Number(addButton.dataset.id);
        cart[itemId] = (cart[itemId] || 0) + 1;
        render();
        return;
    }

    const qtyButton = event.target.closest('.qty-btn');
    if (qtyButton) {
        const itemId = Number(qtyButton.dataset.id);
        const action = qtyButton.dataset.action;

        if (action === 'increase') {
            cart[itemId] = (cart[itemId] || 0) + 1;
        } else if (action === 'decrease') {
            cart[itemId] = Math.max((cart[itemId] || 0) - 1, 0);
            if (cart[itemId] === 0) {
                delete cart[itemId];
            }
        }

        render();
        return;
    }

    const orderButton = event.target.closest('.order-btn');
    if (orderButton) {
        if (!getCartItems().length) return;
        currentView = 'checkout';
        render();
        return;
    }

    const closeButton = event.target.closest('.close-modal');
    if (closeButton) {
        currentView = 'menu';
        render();
        return;
    }

    const backButton = event.target.closest('.back-to-menu');
    if (backButton) {
        cart = {};
        currentView = 'menu';
        render();
    }
});

document.addEventListener('submit', (event) => {
    if (!event.target.matches('#payment-form')) return;

    event.preventDefault();
    const items = getCartItems();
    if (!items.length) return;

    currentView = 'complete';
    render();
});

render();

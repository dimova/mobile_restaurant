(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{name:`Pizza`,ingredients:[`pepperoni`,`mushroom`,`mozzarella`],id:0,price:14,emoji:`🍕`},{name:`Hamburger`,ingredients:[`beef`,`cheese`,`lettuce`],price:12,emoji:`🍔`,id:1},{name:`Beer`,ingredients:[`grain`,`hops`,`yeast`,`water`],price:12,emoji:`🍺`,id:2}],t=document.getElementById(`app`),n={},r=`menu`;function i(e){return new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`}).format(e)}function a(){return e.filter(e=>n[e.id]>0)}function o(){return a().reduce((e,t)=>e+n[t.id],0)}function s(){return a().reduce((e,t)=>e+t.price*n[t.id],0)}function c(){let t=a(),r=s(),c=o();return`
        <div class="phone-shell">
            <header class="topbar">
                <div class="app-brand">
                    <span class="brand-icon" aria-hidden="true">🍽️</span>
                    <h1 class="app-title">Mobile Restaurant Menu (Copy)</h1>
                </div>
                <button class="share-btn" type="button">Share</button>
            </header>

            <main class="menu-list">
                ${e.map(e=>`
                        <article class="menu-item" aria-label="${e.name} menu item">
                            <div class="food-emoji" aria-hidden="true">${e.emoji}</div>
                            <div class="menu-details">
                                <h2 class="menu-name">${e.name}</h2>
                                <p class="menu-ingredients">${e.ingredients.join(`, `)}</p>
                                <div class="item-meta">
                                    <span class="price-tag">${i(e.price)}</span>
                                    <button class="add-btn" type="button" aria-label="Add ${e.name} to order" data-id="${e.id}">+</button>
                                </div>
                            </div>
                        </article>
                    `).join(``)}
            </main>

            <aside class="order-panel">
                <div class="order-header">
                    <h3>Your order</h3>
                    <span class="order-count">${c} item${c===1?``:`s`}</span>
                </div>

                ${t.length===0?`
                    <div class="empty-state">
                        No items selected yet.<br />
                        Tap the + button to add a meal.
                    </div>
                `:`
                    <div class="order-items">
                        ${t.map(e=>`
                                <div class="order-item">
                                    <div class="item-summary">
                                        <span class="item-name">${e.name}</span>
                                        <span class="item-qty">x${n[e.id]}</span>
                                    </div>
                                    <div class="item-actions">
                                        <button class="qty-btn" type="button" data-action="decrease" data-id="${e.id}" aria-label="Remove one ${e.name}">-</button>
                                        <button class="qty-btn" type="button" data-action="increase" data-id="${e.id}" aria-label="Add one ${e.name}">+</button>
                                        <span class="item-price">${i(e.price*n[e.id])}</span>
                                    </div>
                                </div>
                            `).join(``)}
                    </div>
                    <div class="total-row">
                        <span>Total</span>
                        <span>${i(r)}</span>
                    </div>
                    <button class="order-btn" type="button">Place order</button>
                `}
            </aside>
        </div>
    `}function l(){let e=s();return`
        <div class="payment-backdrop" aria-modal="true" role="dialog" aria-label="Checkout payment modal">
            <div class="payment-modal">
                <div class="modal-header">
                    <button class="close-modal" type="button" aria-label="Close checkout">×</button>
                    <h2>Payment</h2>
                    <div class="spacer"></div>
                </div>

                <div class="payment-summary">
                    <span>Order total</span>
                    <strong>${i(e)}</strong>
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

                    <button class="pay-btn" type="submit">Pay ${i(e)}</button>
                </form>
            </div>
        </div>
    `}function u(){return`
        <div class="phone-shell complete-shell">
            <div class="success-container">
                <div class="success-icon" aria-hidden="true">✓</div>
                <p class="success-badge">Payment successful</p>
                <h2>Thank you!</h2>
                <p class="success-text">Your order is on the way.</p>
                <div class="success-total">
                    <span>Total</span>
                    <strong>${i(s()||0)}</strong>
                </div>
                <button class="back-to-menu" type="button">Back to menu</button>
            </div>
        </div>
    `}function d(){if(r===`checkout`){t.innerHTML=l();return}if(r===`complete`){t.innerHTML=u();return}t.innerHTML=c()}document.addEventListener(`click`,e=>{let t=e.target.closest(`.add-btn`);if(t){let e=Number(t.dataset.id);n[e]=(n[e]||0)+1,d();return}let i=e.target.closest(`.qty-btn`);if(i){let e=Number(i.dataset.id),t=i.dataset.action;t===`increase`?n[e]=(n[e]||0)+1:t===`decrease`&&(n[e]=Math.max((n[e]||0)-1,0),n[e]===0&&delete n[e]),d();return}if(e.target.closest(`.order-btn`)){if(!a().length)return;r=`checkout`,d();return}if(e.target.closest(`.close-modal`)){r=`menu`,d();return}e.target.closest(`.back-to-menu`)&&(n={},r=`menu`,d())}),document.addEventListener(`submit`,e=>{e.target.matches(`#payment-form`)&&(e.preventDefault(),a().length&&(r=`complete`,d()))}),d();
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const contactForm = document.getElementById('contact-form');

    // Actualizar carrito
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <p>${item.name} (x${item.quantity || 1}) - $${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                    <div>
                        <button class="btn decrease-qty" data-id="${item.id}">-</button>
                        <button class="btn increase-qty" data-id="${item.id}">+</button>
                        <button class="btn remove-from-cart" data-id="${item.id}">Eliminar</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += parseFloat(item.price) * (item.quantity || 1);
            });
        }

        cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Quitar producto
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                removeFromCart(id);
            });
        });
        // Aumentar cantidad
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                changeQuantity(id, 1);
            });
        });
        // Disminuir cantidad
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                changeQuantity(id, -1);
            });
        });

        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
        }
    }

    // Añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price
            };
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            updateCart();
        });
    });

    // Eliminar del carrito
    function removeFromCart(id) {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

    // Cambiar cantidad
    function changeQuantity(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = (item.quantity || 1) + delta;
            if (item.quantity < 1) {
                removeFromCart(id);
            } else {
                updateCart();
            }
        }
    }

    // Vaciar carrito
    clearCartButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            cart.length = 0;
            updateCart();
        }
    });

    // Validar formulario de contacto
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        alert('Mensaje enviado con éxito.');
        contactForm.reset();
    });

    // Chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
        });
    }
    if (chatbotClose && chatbotContainer) {
        chatbotClose.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });
    }
    if (chatbotSend && chatbotInput && chatbotMessages) {
        chatbotSend.addEventListener('click', async () => {
            const message = chatbotInput.value.trim();
            if (!message) return;

            const userMessage = document.createElement('div');
            userMessage.classList.add('message', 'user');
            userMessage.textContent = message;
            chatbotMessages.appendChild(userMessage);
            chatbotInput.value = '';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Aquí deberías poner una API real, ¡esto es solo un ejemplo!
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                botMessage.textContent = '¡Hola! Gracias por tu mensaje. Pronto te responderemos.';
                chatbotMessages.appendChild(botMessage);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 900);
        });

        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatbotSend.click();
            }
        });
    }

    // Inicializar carrito
    updateCart();
});

// Menú hamburguesa y cierre
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if(menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });

        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && e.target !== menuToggle) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // ------ CARRITO LATERAL ------
    const cartLink = document.getElementById('cart-link');
    const sideCart = document.getElementById('side-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');

    function closeCart() {
        sideCart.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartLink && sideCart && cartOverlay) {
        cartLink.addEventListener('click', function() {
            sideCart.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // ------ LÓGICA DE CARRITO ------
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const clearCartButton = document.getElementById('clear-cart');
    const sideCartBody = document.getElementById('side-cart-body');

    function updateCart() {
        // Actualiza el carrito central
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

        // Actualiza el carrito lateral
        if (cart.length === 0) {
            sideCartBody.innerHTML = `
              <div class="empty-cart">
                <p>LA CESTA ESTÁ VACÍA</p>
                <button class="btn-large" id="seguir-comprando">Seguir comprando</button>
              </div>
            `;
            // Reasignar evento al botón (se recrea el HTML)
            const seguirComprandoBtn = document.getElementById('seguir-comprando');
            if (seguirComprandoBtn) seguirComprandoBtn.addEventListener('click', closeCart);
        } else {
            let productosHTML = cart.map(item => `
              <div class="sidecart-item">
                <span>${item.name}</span>
                <span>x${item.quantity || 1}</span>
                <span>${(item.price * (item.quantity || 1)).toFixed(2)}€</span>
              </div>
            `).join('');
            sideCartBody.innerHTML = `
              <div class="sidecart-list">
                ${productosHTML}
              </div>
              <div class="sidecart-total">
                <strong>Total:</strong> ${total.toFixed(2)}€
              </div>
              <button class="btn-large" id="seguir-comprando">Seguir comprando</button>
              <button class="btn-large btn-comprar" id="comprar-btn">Comprar</button>
            `;
            // Reasignar evento al botón (se recrea el HTML)
            const seguirComprandoBtn = document.getElementById('seguir-comprando');
            if (seguirComprandoBtn) seguirComprandoBtn.addEventListener('click', closeCart);
        }

        // Botones de aumentar/disminuir/eliminar (carrito central)
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                removeFromCart(id);
            });
        });
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                changeQuantity(id, 1);
            });
        });
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

    // Añadir al carrito desde las cards
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.dataset.name,
                price: productCard.dataset.price.replace(",", ".") // Por si acaso usan coma
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

    function removeFromCart(id) {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }

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

    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                cart.length = 0;
                updateCart();
            }
        });
    }

    // ------ FORMULARIO DE CONTACTO ------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
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
    }

    // ------ CHATBOT ------
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// IA simulada: respuestas automáticas por palabras clave
function responderComoBot(mensaje) {
    const msg = mensaje.toLowerCase();

    // ENVÍO: acepta "envio", "envío", "envios", "envíos"
    if (msg.match(/env[íi]o?s?/)) {
        return "Nuestros envíos suelen tardar entre 24 y 48 horas.";
    }
    // DEVOLUCIÓN: acepta "devolucion", "devolución", "devolver"
    if (msg.match(/devoluci[óo]n|devolver/)) {
        return "Puedes solicitar una devolución en un plazo de 15 días desde la recepción del pedido.";
    }
    // PAGO: acepta "pago", "pagos", "metodo de pago", "método de pago"
    if (msg.match(/pago?s?|m[eé]todo de pago/)) {
        return "Aceptamos pagos con tarjeta, PayPal y otros métodos seguros.";
    }
    // DESCUENTO: acepta "descuento", "descuentos"
    if (msg.match(/descuentos?/)) {
        return "Actualmente tenemos promociones en varias camisetas. ¡No olvides revisar nuestro catálogo!";
    }
    // SALUDOS
    if (msg.match(/hola|buenas|saludos/)) {
        return "¡Hola! ¿En qué puedo ayudarte?";
    }
    // AYUDA
    if (msg.match(/ayuda/)) {
        return "Claro, dime qué necesitas y trataré de ayudarte.";
    }
    // Respuesta por defecto
    return "Lo siento, no entiendo tu pregunta. ¿Puedes reformularla?";
}

if (chatbotToggle && chatbotContainer) {
    let hasWelcomed = false;
    chatbotToggle.addEventListener('click', () => {
        const isOpen = chatbotContainer.style.display === 'block';
        chatbotContainer.style.display = isOpen ? 'none' : 'block';
        if (!isOpen && !hasWelcomed) {
            // Mensaje de bienvenida automático
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot');
            botMessage.textContent = '¡Hola! Soy el asistente virtual de Vortex. ¿En qué puedo ayudarte?';
            chatbotMessages.appendChild(botMessage);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            hasWelcomed = true;
        }
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

        // IA simulada: responde por palabras clave
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot');
            botMessage.textContent = responderComoBot(message);
            chatbotMessages.appendChild(botMessage);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 600);
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatbotSend.click();
        }
    });
}

    // ------ MENÚ HAMBURGUESA ------
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

    // ------ PRODUCTO DETALLE (opcional, si tienes página de detalle) ------
    // Cambiar imagen principal
    if (document.getElementById('main-product-img')) {
        window.selectImg = function(img) {
            document.getElementById('main-product-img').src = img.src;
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        };
    }

    // Selección de talla
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Añadir al carrito desde la página de detalle (si existe el form)
    if (document.getElementById('add-to-cart-form')) {
        document.getElementById('add-to-cart-form').addEventListener('submit', function(e){
            e.preventDefault();
            const selectedSize = document.querySelector('.size-btn.selected').dataset.size;
            // Aquí puedes llamar a tu lógica de carrito (adaptar según tu JS global)
            alert('Añadido al carrito: BUILD TEE, talla ' + selectedSize);
        });
    }

    // Inicializar carrito principal
    updateCart();

    // ------ CHECKOUT ------
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutSummary = document.getElementById('checkout-summary');
    const checkoutSuccess = document.getElementById('checkout-success');

    // Abrir checkout desde el botón
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'comprar-btn') {
            // Mostrar resumen del pedido
            if (cart.length === 0) return; // No abrir si está vacío
            checkoutSummary.innerHTML = cart.map(item => 
                `<div>${item.name} (x${item.quantity}) - ${Number(item.price * item.quantity).toFixed(2)}€</div>`
            ).join('') +
            `<div style="text-align:right;margin-top:8px;"><strong>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}€</strong></div>`;
            checkoutForm.style.display = '';
            checkoutSuccess.style.display = 'none';
            checkoutModal.classList.add('active');
        }
    });
    // Cerrar modal
    if (checkoutClose) checkoutClose.addEventListener('click', ()=> checkoutModal.classList.remove('active'));
    // Cerrar clicando fuera de la caja
    checkoutModal.addEventListener('click', (e)=>{
        if (e.target === checkoutModal) checkoutModal.classList.remove('active');
    });
    // Simula compra
    if (checkoutForm) checkoutForm.addEventListener('submit', function(e){
        e.preventDefault();
        // Mostrar mensaje de éxito y vaciar carrito
        checkoutForm.style.display = 'none';
        checkoutSuccess.style.display = '';
        cart.length = 0;
        updateCart();
        setTimeout(()=>checkoutModal.classList.remove('active'), 2000);
    });
});
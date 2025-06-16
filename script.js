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

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <p>${item.name} (x${item.quantity || 1}) - $${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                <button class="btn remove-from-cart" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += parseFloat(item.price) * (item.quantity || 1);
        });

        cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                removeFromCart(id);
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
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;

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

    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    chatbotSend.addEventListener('click', async () => {
        const message = chatbotInput.value.trim();
        if (!message) return;

        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user');
        userMessage.textContent = message;
        chatbotMessages.appendChild(userMessage);
        chatbotInput.value = '';

        try {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY' // Reemplaza con tu clave de API
                },
                body: JSON.stringify({
                    model: 'grok-3',
                    messages: [
                        { role: 'system', content: 'Eres un asistente de Vortex, una tienda de camisetas. Ayuda con preguntas sobre productos, tallas, envíos y más.' },
                        { role: 'user', content: message }
                    ]
                })
            });

            if (!response.ok) throw new Error('Error en la respuesta de la API');
            const data = await response.json();
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot');
            botMessage.textContent = data.choices[0].message.content;
            chatbotMessages.appendChild(botMessage);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        } catch (error) {
            console.error('Error al conectar con la API:', error);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'bot');
            errorMessage.textContent = 'Lo siento, hubo un error. Intenta de nuevo.';
            chatbotMessages.appendChild(errorMessage);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatbotSend.click();
        }
    });

    // Inicializar carrito
    updateCart();
});
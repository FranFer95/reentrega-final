let cart = [];
const cartContainer = document.getElementById('cart');
const totalContainer = document.getElementById('total');
const cartCount = document.getElementById('cart-count');

function addToCart(productId) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color: black;">El carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const product = findProductById(item.id);
            total += product.price * item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;">
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <h4>${product.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <p>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </p>
                <p>Subtotal: $${(product.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            cartContainer.appendChild(cartItemDiv);
        });

        const finishButton = document.createElement('button');
        finishButton.innerText = 'Finalizar Compra';
        finishButton.onclick = showCheckoutForm;
        cartContainer.appendChild(finishButton);
    }

    totalContainer.innerText = `Total: $${total.toFixed(2)}`;
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showCheckoutForm() {
    const formHtml = `
        <h3>Detalles de Compra</h3>
        <input type="text" id="name" placeholder="Nombre" required>
        <input type="email" id="email" placeholder="Email" required>
        <button id="submit-checkout">Confirmar</button>
    `;
    cartContainer.innerHTML = formHtml;

    document.getElementById('submit-checkout').onclick = finalizePurchase;
}

function finalizePurchase() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        Swal.fire({
            title: '¡Compra finalizada!',
            text: `Gracias, ${name}. Compraste:\n` + cart.map(item => {
                const product = findProductById(item.id);
                return `${product.name} - Cantidad: ${item.quantity}`;
            }).join('\n'),
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            cart = [];
            updateCart();
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function changeQuantity(productId, amount) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function findProductById(id) {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
}
 
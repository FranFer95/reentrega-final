const productsContainer = document.getElementById('products');

async function fetchProducts() {
    const response = await fetch('./JSON/products.json');
    const products = await response.json();
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(products);
}

function displayProducts(products) {
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

fetchProducts();
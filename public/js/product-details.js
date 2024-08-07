import { fetchProductDetails, fetchRelatedProducts, toggleFavorite } from './api.js';
import { isLoggedIn, updateAuthUI } from './auth.js';

let currentProduct = null;

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        displayError('No product ID provided');
        return;
    }

    try {
        currentProduct = await fetchProductDetails(productId);
        displayProductDetails(currentProduct);
        await loadRelatedProducts(currentProduct.brand);
        setupFavoriteButton();
    } catch (error) {
        console.error('Error loading product details:', error);
        if (error.message === 'Unauthorized') {
            displayError('Please log in to view product details');
        } else {
            displayError('Error loading product details');
        }
    }
}


function displayProductDetails(product) {
    const detailsContainer = document.getElementById('product-details');
    detailsContainer.innerHTML = `
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <p class="product-price">Price: $${product.price.toFixed(2)}</p>
        <p class="product-brand">Brand: ${product.brand}</p>
        <p class="product-category">Category: ${product.category}</p>
        <p class="product-stock">${product.inStock ? 'In Stock' : 'Out of Stock'}</p>
        <p class="product-description">${product.description}</p>
    `;
}

async function loadRelatedProducts(brand) {
    try {
        const relatedProducts = await fetchRelatedProducts(brand);
        if (Array.isArray(relatedProducts) && relatedProducts.length > 0) {
            displayRelatedProducts(relatedProducts);
        } else {
            console.log('No related products found');
            document.getElementById('related-products').innerHTML = '<p>No related products found.</p>';
        }
    } catch (error) {
        console.error('Error loading related products:', error);
        document.getElementById('related-products').innerHTML = '<p>Error loading related products.</p>';
    }
}

function displayRelatedProducts(products) {
    if (!Array.isArray(products)) {
        console.error('Expected an array of products, but got:', products);
        return;
    }
    const container = document.getElementById('related-products');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <a href="product-details.html?id=${product._id}">View Details</a>
        </div>
    `).join('');
}

function setupFavoriteButton() {
    const favoriteButton = document.getElementById('favorite-button');
    favoriteButton.addEventListener('click', async () => {
        if (!isLoggedIn()) {
            alert('Please log in to add favorites');
            return;
        }
        try {
            await toggleFavorite(currentProduct._id);
            alert('Favorite status updated');
        } catch (error) {
            console.error('Error updating favorite status:', error);
            alert('Error updating favorite status');
        }
    });
}

function displayError(message) {
    const detailsContainer = document.getElementById('product-details');
    detailsContainer.innerHTML = `<p class="error">${message}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadProductDetails();
});
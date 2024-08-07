import { 
    fetchProducts, 
    fetchBrands, 
    fetchProductTypes, 
    toggleFavorite as apiToggleFavorite, 
    fetchFavorites as apiFetchFavorites 
} from './api.js';
import { isLoggedIn, updateAuthUI } from './auth.js';

let currentPage = 1;
let totalPages = 1;
let currentFilters = { brands: [], categories: [] };

async function initializePage() {
    updateAuthUI();
    await Promise.all([loadFilters(), loadProducts()]);
    if (isLoggedIn()) {
        await loadFavorites();
    }
    setupEventListeners();
}

async function loadFilters() {
    try {
        const [brands, categories] = await Promise.all([
            fetchBrands(),
            fetchProductTypes()
        ]);
        
        console.log('Brands:', brands);
        console.log('Categories:', categories);
        
        displayFilters('brand-filters', brands);
        displayFilters('category-filters', categories);
    } catch (error) {
        console.error('Error loading filters:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('Response:', await error.response.text());
        }
    }
}

function displayFilters(containerId, items) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map(item => `
        <label>
            <input type="checkbox" name="${containerId}" value="${item}">
            ${item}
        </label>
    `).join('');
}

async function loadProducts() {
    try {
        const data = await fetchProducts(currentPage, currentFilters);
        displayProducts(data.products);
        updatePagination(data.currentPage, data.totalPages);
        totalPages = data.totalPages;
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-container').innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="product-brand">${product.brand}</p>
            <p class="product-category">${product.category}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <a href="product-details.html?id=${product._id}" class="view-details">View Details</a>
            <button class="favorite-button" data-id="${product._id}">
                ${product.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
    `).join('');
}

function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = `
        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

async function loadFavorites() {
    try {
        const favorites = await apiFetchFavorites();
        displayFavorites(favorites);
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

function displayFavorites(favorites) {
    const container = document.getElementById('favorites-list');
    container.innerHTML = favorites.map(favorite => `
        <li>${favorite.name} <button class="remove-favorite" data-id="${favorite._id}">Remove</button></li>
    `).join('');
}

function setupEventListeners() {
    document.getElementById('filter-form').addEventListener('submit', handleFilterSubmit);
    document.getElementById('products-container').addEventListener('click', handleProductClick);
    document.getElementById('favorites-list').addEventListener('click', handleFavoriteClick);
    document.getElementById('pagination').addEventListener('click', handlePaginationClick);
}

async function handleFilterSubmit(e) {
    e.preventDefault();
    currentFilters.brands = Array.from(document.querySelectorAll('#brand-filters input:checked')).map(input => input.value);
    currentFilters.categories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(input => input.value);
    currentPage = 1;
    await loadProducts();
}

async function handleProductClick(e) {
    if (e.target.classList.contains('favorite-button')) {
        const productId = e.target.dataset.id;
        await toggleFavorite(productId);
        await loadProducts();
        if (isLoggedIn()) {
            await loadFavorites();
        }
    }
}

async function handleFavoriteClick(e) {
    if (e.target.classList.contains('remove-favorite')) {
        const productId = e.target.dataset.id;
        await toggleFavorite(productId);
        await Promise.all([loadFavorites(), loadProducts()]);
    }
}

function handlePaginationClick(e) {
    if (e.target.id === 'prev-page' && currentPage > 1) {
        currentPage--;
        loadProducts();
    } else if (e.target.id === 'next-page' && currentPage < totalPages) {
        currentPage++;
        loadProducts();
    }
}

async function toggleFavorite(productId) {
    try {
        await apiToggleFavorite(productId);
    } catch (error) {
        console.error('Error toggling favorite:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializePage);
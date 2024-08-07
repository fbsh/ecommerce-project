const API_URL = 'http://localhost:3000/api';

async function register(username, email, password) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();
}

async function login(emailOrUsername, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }
    return response.json();
}

async function fetchProducts(page = 1, filters = {}) {
    const queryParams = new URLSearchParams({ page, ...filters });
    const response = await fetch(`${API_URL}/products?${queryParams}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

async function fetchBrands() {
    const response = await fetch(`${API_URL}/products/brands`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function fetchProductTypes() {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

async function toggleFavorite(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to toggle favorite');
    }
    return response.json();
}

async function fetchFavorites() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }
    const response = await fetch(`${API_URL}/favorites`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch favorites');
    }
    return response.json();
}

async function fetchUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return response.json();
}

async function fetchProductDetails(productId) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products/details/${productId}`, { headers });
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
}

async function fetchRelatedProducts(brand) {
    const response = await fetch(`${API_URL}/products?brand=${encodeURIComponent(brand)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch related products');
    }
    const data = await response.json();
    // Ensure we're returning an array of products
    return Array.isArray(data) ? data : data.products || [];
}

// At the end of your api.js file
export {
    API_URL,
    login,
    register,
    fetchProducts,
    fetchBrands,
    fetchProductTypes,
    toggleFavorite,
    fetchFavorites,
    fetchUserInfo,
    fetchProductDetails,
    fetchRelatedProducts
};
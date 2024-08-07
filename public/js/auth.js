import { API_URL, login as apiLogin, fetchUserInfo as apiFetchUserInfo } from './api.js';

// Helper Functions
export function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

export function isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
}

// Authentication Functions
export async function login(emailOrUsername, password) {
    try {
        const data = await apiLogin(emailOrUsername, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.role);
        
        updateAuthUI();
        return true;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// UI Functions
export function updateAuthUI() {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const userInfo = document.getElementById('user-info');
    const username = document.getElementById('username');
    const adminLink = document.getElementById('admin-link');

    if (isLoggedIn()) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        logoutLink.style.display = 'inline';
        userInfo.style.display = 'inline';
        
        apiFetchUserInfo().then(user => {
            username.textContent = user.username;
        }).catch(error => console.error('Error fetching user info:', error));

        if (isAdmin()) {
            adminLink.style.display = 'inline';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        logoutLink.style.display = 'none';
        userInfo.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Expose necessary functions to window object for global access if needed
window.login = login;
window.logout = logout;
window.isAdmin = isAdmin;
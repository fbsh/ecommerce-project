import { API_URL } from './api.js';
import { isAdmin, logout } from './auth.js';

// Initialization
function initAdminPage() {
    console.log('Initializing admin page');
    if (!isAdmin()) {
        console.log('Not an admin, redirecting...');
        window.location.href = 'index.html';
        return;
    }
    console.log('Admin verified, loading users...');
    loadUsers();
    setupEventListeners();
}

// Data Fetching
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
        displayError('Failed to load users. Please try again later.');
    }
}

// UI Functions
function displayUsers(users) {
    const tableBody = document.getElementById('user-table-body');
    if (!tableBody) {
        console.error('User table body element not found');
        return;
    }
    
    tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>${user.favorites ? user.favorites.length : 0} items</td>
        </tr>
    `).join('');
}

function displayError(message) {
    const tableBody = document.getElementById('user-table-body');
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="4">${escapeHtml(message)}</td></tr>`;
    }
}

// Utility Functions
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function setupEventListeners() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initAdminPage);
import { API_URL, login as apiLogin } from './api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailOrUsername = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');

    try {
        const data = await apiLogin(emailOrUsername, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.role);
        window.location.href = 'index.html'; // Redirect to home page after successful login
    } catch (error) {
        errorMessageElement.textContent = error.message;
    }
});
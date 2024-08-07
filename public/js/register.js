document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessageElement = document.getElementById('error-message');

    // Client-side validation
    if (password !== confirmPassword) {
        errorMessageElement.textContent = 'Passwords do not match';
        return;
    }

    if (password.length < 8) {
        errorMessageElement.textContent = 'Password must be at least 8 characters long';
        return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        errorMessageElement.textContent = 'Password must contain uppercase, lowercase, number, and special characters';
        return;
    }

    if (!/^[A-Za-z0-9]+$/.test(username)) {
        errorMessageElement.textContent = 'Username can only contain letters and numbers';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessageElement.textContent = 'Invalid email format';
        return;
    }

    try {
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

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'index.html'; // Redirect to home page after successful registration
    } catch (error) {
        errorMessageElement.textContent = error.message;
    }
});
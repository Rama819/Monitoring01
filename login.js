document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    const USERNAME = 'Rama';
    const PASSWORD = '311205';

    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === USERNAME && password === PASSWORD) {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'profile.html';
        } else {
            loginError.textContent = 'Username atau password salah.';
        }
    }

    loginForm.addEventListener('submit', handleLogin);
});

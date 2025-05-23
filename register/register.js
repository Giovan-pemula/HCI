document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    // Change header background on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Check if user is already logged in
    checkLoginStatus();

    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            
            // Get existing users or create empty array
            let users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if username already exists
            if (users.some(user => user.username === username)) {
                alert('Username sudah digunakan. Silakan pilih username lain.');
                return;
            }
            
            // Add new user - always as regular user role
            users.push({
                name: name,
                username: username,
                phone: phone,
                password: password,
                role: 'user'
            });
            
            // Save updated users to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Alert success and redirect to login page instead of home page
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = '../login/login.html';
        });
    }
});

// Function to check login status and update header
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('.login-btn');
    
    if (currentUser && loginBtn) {
        loginBtn.textContent = currentUser.name;
        loginBtn.href = '#';
        
        // Add logout functionality on click
        loginBtn.addEventListener('click', function(e) {
            if (confirm('Apakah Anda ingin logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            }
            e.preventDefault();
        });
    }
} 
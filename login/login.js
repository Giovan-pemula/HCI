document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
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

    // Create pre-defined doctor accounts
    createPredefinedDoctors();

    // Check if user is already logged in
    checkLoginStatus();

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Get registered users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user with matching username and password
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Store logged in user in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    name: user.name,
                    username: user.username,
                    role: user.role || 'user'
                }));
                
                // Alert success and redirect to appropriate page based on role
                alert('Login berhasil!');
                
                if (user.role === 'doctor') {
                    window.location.href = '../doctor/doctor.html';
                } else {
                    window.location.href = '../index.html';
                }
            } else {
                alert('Username atau password salah. Silakan coba lagi.');
            }
        });
    }
});

// Function to create pre-defined doctor accounts
function createPredefinedDoctors() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // List of pre-defined doctors
    const predefinedDoctors = [
        {
            name: 'Dr. Hendri Yanto',
            username: 'doctor1',
            password: 'doctor123',
            role: 'doctor'
        },
        {
            name: 'Dr. Siti Rahmawati',
            username: 'doctor2',
            password: 'doctor123',
            role: 'doctor'
        },
        {
            name: 'Dr. Bambang Sugiarto',
            username: 'doctor3',
            password: 'doctor123',
            role: 'doctor'
        }
    ];
    
    // Check if each doctor already exists, add if not
    let doctorsAdded = false;
    
    predefinedDoctors.forEach(doctor => {
        if (!users.some(user => user.username === doctor.username)) {
            users.push(doctor);
            doctorsAdded = true;
        }
    });
    
    // Save updated users to localStorage if any doctor was added
    if (doctorsAdded) {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Pre-defined doctor accounts created.');
    }
}

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
document.addEventListener('DOMContentLoaded', function() {
    // Reference to DOM elements
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Change header background on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Check if user is logged in as a doctor
    checkDoctorLoginStatus();

    // Send message when button is clicked
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Send message when Enter key is pressed
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Function to send message
    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message) {
            // Create new message element
            const messageElement = document.createElement('div');
            messageElement.className = 'message doctor';
            
            messageElement.innerHTML = `
                <div class="message-bubble">
                    <p>${message}</p>
                </div>
                <img src="mukadokter.png" alt="Doctor" class="message-avatar">
            `;
            
            // Add message to chat
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// Function to check if user is logged in as a doctor
function checkDoctorLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('.login-btn');
    
    // Redirect if not logged in as doctor
    if (!currentUser || currentUser.role !== 'doctor') {
        alert('Anda tidak memiliki akses ke halaman ini. Silakan login sebagai dokter.');
        window.location.href = '../login/login.html';
        return;
    }
    
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
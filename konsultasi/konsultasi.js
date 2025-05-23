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

    // Check if user is logged in
    checkLoginStatus();

    // Authentication check for consultation page
    checkAuthentication();

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
            messageElement.className = 'message user';
            
            // Get current user from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const userName = currentUser ? currentUser.name : 'User';
            
            messageElement.innerHTML = `
                <div class="message-bubble">
                    <p>${message}</p>
                </div>
                <img src="simpansini.png" alt="${userName}" class="message-avatar">
            `;
            
            // Add message to chat
            chatMessages.appendChild(messageElement);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate doctor response after short delay
            setTimeout(generateDoctorResponse, 1000, message);
        }
    }
    
    // Function to generate doctor response
    function generateDoctorResponse(userMessage) {
        // Simple response logic - in a real app, this would be more complex
        let responseText;
        const lowerMsg = userMessage.toLowerCase();
        
        if (lowerMsg.includes('kurus') || lowerMsg.includes('berat badan')) {
            responseText = "Untuk anak yang kurus, Anda bisa mencoba memberi makanan tinggi kalori dan nutrisi seperti alpukat, keju, dan yogurt. Berapa usia anak Anda?";
        } else if (lowerMsg.includes('alergi') || lowerMsg.includes('telur')) {
            responseText = "Alergi telur cukup umum pada anak-anak. Anda bisa mengganti telur dengan tahu atau chia seeds sebagai sumber protein. Sudah konsultasi ke dokter anak untuk tes alergi?";
        } else if (lowerMsg.includes('halo') || lowerMsg.includes('hai') || lowerMsg.includes('hi')) {
            responseText = "Halo! Ada yang bisa saya bantu seputar kesehatan bayi Anda?";
        } else if (lowerMsg.includes('makanan') || lowerMsg.includes('makan')) {
            responseText = "Pola makan yang baik sangat penting untuk perkembangan bayi. Apa yang ingin Anda ketahui tentang nutrisi bayi?";
        } else {
            responseText = "Terima kasih atas informasinya. Ada hal lain yang ingin ditanyakan?";
        }
        
        // Create doctor response element
        const responseElement = document.createElement('div');
        responseElement.className = 'message doctor';
        
        responseElement.innerHTML = `
            <img src="mukadokter.png" alt="Doctor" class="message-avatar">
            <div class="message-bubble">
                <p>${responseText}</p>
            </div>
        `;
        
        // Add response to chat
        chatMessages.appendChild(responseElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
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

// Function to check if user is authenticated
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // If no user is logged in, redirect to login page
    if (!currentUser) {
        alert('Anda harus login untuk mengakses halaman konsultasi.');
        window.location.href = '../login/login.html';
        return;
    }
    
    // If user is a doctor, redirect to doctor page
    if (currentUser.role === 'doctor') {
        window.location.href = '../doctor/doctor.html';
    }
} 
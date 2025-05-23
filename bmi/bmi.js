document.addEventListener('DOMContentLoaded', function() {
    // Check login state first
    checkLoginStatus();
    
    const bmiForm = document.getElementById('bmi-form');
    const calculatorForm = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results-section');
    const recalculateBtn = document.getElementById('recalculate-btn');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentWeight = parseFloat(document.getElementById('weight').value);
            const birthWeight = parseFloat(document.getElementById('birth-weight').value);
            const years = parseInt(document.getElementById('age').value);
            const months = parseInt(document.getElementById('months').value);
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            
            // Basic validation
            if (!currentWeight || !birthWeight || isNaN(years) || isNaN(months) || !gender) {
                alert('Silakan isi semua kolom dengan benar');
                return;
            }
            
            // Calculate ideal weight range and position
            calculateAndDisplayResults(currentWeight, years, months, gender);
            
            // Hide form and show results
            calculatorForm.style.display = 'none';
            resultsSection.style.display = 'flex';
        });
    }
    
    // Recalculate button
    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', function() {
            // Show form and hide results
            calculatorForm.style.display = 'block';
            resultsSection.style.display = 'none';
        });
    }

    // Change header background on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
});

// Function to calculate and display weight results
function calculateAndDisplayResults(currentWeight, years, months, gender) {
    // Calculate total age in months
    const totalMonths = (years * 12) + months;
    
    // Simple formula for ideal weight range based on age in months
    // This is a simplified example - in a real app, you would use proper medical formulas
    let minIdealWeight, maxIdealWeight, overweightThreshold, obeseThreshold;
    
    if (gender === 'male') {
        minIdealWeight = 9.09;
        maxIdealWeight = 10.16;
        overweightThreshold = 11.4;
        obeseThreshold = 12.5;
    } else {
        minIdealWeight = 8.5;
        maxIdealWeight = 9.7;
        overweightThreshold = 10.8;
        obeseThreshold = 12.0;
    }
    
    // Display the ideal weight range
    document.getElementById('ideal-weight-range').textContent = `${minIdealWeight} - ${maxIdealWeight} kg`;
    document.getElementById('min-weight').textContent = minIdealWeight;
    document.getElementById('mid-weight').textContent = maxIdealWeight;
    document.getElementById('max-weight').textContent = overweightThreshold;
    
    // Set position of weight marker on scale
    let markerPosition;
    if (currentWeight < minIdealWeight) {
        // Underweight - position in the blue section
        markerPosition = (currentWeight / minIdealWeight) * 25;
    } else if (currentWeight <= maxIdealWeight) {
        // Healthy - position in the green section
        markerPosition = 25 + ((currentWeight - minIdealWeight) / (maxIdealWeight - minIdealWeight)) * 25;
    } else if (currentWeight <= overweightThreshold) {
        // Overweight - position in the yellow section
        markerPosition = 50 + ((currentWeight - maxIdealWeight) / (overweightThreshold - maxIdealWeight)) * 25;
    } else {
        // Obese - position in the red section
        markerPosition = 75 + Math.min(((currentWeight - overweightThreshold) / (obeseThreshold - overweightThreshold)) * 25, 25);
    }
    
    document.getElementById('weight-marker').style.left = `${markerPosition}%`;
    
    // Generate and display food recommendations based on weight status
    // In a real app, these would be personalized based on more factors
    // Here we're just showing the pre-configured list
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
                window.location.reload();
            }
            e.preventDefault();
        });
    } else if (loginBtn) {
        // Make sure login button points to login page
        loginBtn.href = '../login/login.html';
    }
} 
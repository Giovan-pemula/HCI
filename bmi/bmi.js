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
            const height = parseFloat(document.getElementById('height').value);
            const birthWeight = parseFloat(document.getElementById('birth-weight').value);
            const years = parseInt(document.getElementById('age').value);
            const months = parseInt(document.getElementById('months').value);
            const gender = document.querySelector('input[name="gender"]:checked')?.value;
            
            // Basic validation
            if (!currentWeight || !height || !birthWeight || isNaN(years) || isNaN(months) || !gender) {
                alert('Silakan isi semua kolom dengan benar');
                return;
            }
            
            // Calculate ideal weight range and position
            calculateAndDisplayResults(currentWeight, height, years, months, gender);
            
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
function calculateAndDisplayResults(currentWeight, height, years, months, gender) {
    // Calculate total age in months
    const totalMonths = (years * 12) + months;
    
    // Convert height to cm if needed
    const heightInCm = height;
    const heightInMeters = height / 100;
    
    // Calculate weight-for-length/height z-scores based on WHO standards
    let weightStatus;
    let idealWeightRange;
    
    if (totalMonths <= 24) { // 0-24 months - use weight-for-length
        if (gender === 'male') {
            if (heightInCm < 45) {
                idealWeightRange = calculateIdealWeight(2.5, 3.3); // 0-45cm male
            } else if (heightInCm < 55) {
                idealWeightRange = calculateIdealWeight(4.0, 5.0); // 45-55cm male
            } else if (heightInCm < 65) {
                idealWeightRange = calculateIdealWeight(6.0, 7.5); // 55-65cm male
            } else if (heightInCm < 75) {
                idealWeightRange = calculateIdealWeight(7.5, 9.5); // 65-75cm male
            } else {
                idealWeightRange = calculateIdealWeight(9.0, 11.0); // 75cm+ male
            }
        } else { // female
            if (heightInCm < 45) {
                idealWeightRange = calculateIdealWeight(2.4, 3.2); // 0-45cm female
            } else if (heightInCm < 55) {
                idealWeightRange = calculateIdealWeight(3.8, 4.8); // 45-55cm female
            } else if (heightInCm < 65) {
                idealWeightRange = calculateIdealWeight(5.8, 7.2); // 55-65cm female
            } else if (heightInCm < 75) {
                idealWeightRange = calculateIdealWeight(7.3, 9.2); // 65-75cm female
            } else {
                idealWeightRange = calculateIdealWeight(8.6, 10.6); // 75cm+ female
            }
        }
    } else if (totalMonths <= 60) { // 2-5 years - use BMI-for-age
        // Calculate BMI
        const bmi = currentWeight / (heightInMeters * heightInMeters);
        
        if (gender === 'male') {
            if (totalMonths <= 36) {
                idealWeightRange = {
                    min: (15.0 * heightInMeters * heightInMeters),
                    max: (17.2 * heightInMeters * heightInMeters),
                    overweight: (18.2 * heightInMeters * heightInMeters),
                    obese: (19.2 * heightInMeters * heightInMeters)
                };
            } else {
                idealWeightRange = {
                    min: (14.5 * heightInMeters * heightInMeters),
                    max: (16.8 * heightInMeters * heightInMeters),
                    overweight: (17.8 * heightInMeters * heightInMeters),
                    obese: (18.8 * heightInMeters * heightInMeters)
                };
            }
        } else { // female
            if (totalMonths <= 36) {
                idealWeightRange = {
                    min: (14.8 * heightInMeters * heightInMeters),
                    max: (17.0 * heightInMeters * heightInMeters),
                    overweight: (18.0 * heightInMeters * heightInMeters),
                    obese: (19.0 * heightInMeters * heightInMeters)
                };
            } else {
                idealWeightRange = {
                    min: (14.3 * heightInMeters * heightInMeters),
                    max: (16.5 * heightInMeters * heightInMeters),
                    overweight: (17.5 * heightInMeters * heightInMeters),
                    obese: (18.5 * heightInMeters * heightInMeters)
                };
            }
        }
    } else { // Above 5 years - use standard BMI-for-age
        const bmi = currentWeight / (heightInMeters * heightInMeters);
        
        if (gender === 'male') {
            idealWeightRange = {
                min: (14.0 * heightInMeters * heightInMeters),
                max: (16.5 * heightInMeters * heightInMeters),
                overweight: (17.5 * heightInMeters * heightInMeters),
                obese: (18.5 * heightInMeters * heightInMeters)
            };
        } else {
            idealWeightRange = {
                min: (13.5 * heightInMeters * heightInMeters),
                max: (16.0 * heightInMeters * heightInMeters),
                overweight: (17.0 * heightInMeters * heightInMeters),
                obese: (18.0 * heightInMeters * heightInMeters)
            };
        }
    }

    // Round all weight values to 2 decimal places
    const minIdealWeight = Math.round(idealWeightRange.min * 100) / 100;
    const maxIdealWeight = Math.round(idealWeightRange.max * 100) / 100;
    const overweightThreshold = Math.round(idealWeightRange.overweight * 100) / 100;
    const obeseThreshold = Math.round(idealWeightRange.obese * 100) / 100;

    // Calculate BMI
    const bmi = currentWeight / (heightInMeters * heightInMeters);
    const roundedBmi = Math.round(bmi * 10) / 10;

    // Determine weight status
    if (currentWeight < minIdealWeight) {
        weightStatus = 'underweight';
    } else if (currentWeight <= maxIdealWeight) {
        weightStatus = 'healthy';
    } else if (currentWeight <= overweightThreshold) {
        weightStatus = 'overweight';
    } else {
        weightStatus = 'obese';
    }

    // Display the ideal weight range
    document.getElementById('ideal-weight-range').textContent = `${minIdealWeight} - ${maxIdealWeight} kg`;
    document.getElementById('min-weight').textContent = minIdealWeight;
    document.getElementById('mid-weight').textContent = maxIdealWeight;
    document.getElementById('max-weight').textContent = overweightThreshold;

    // Set position of weight marker on scale
    let markerPosition;
    if (currentWeight < minIdealWeight) {
        markerPosition = (currentWeight / minIdealWeight) * 25;
    } else if (currentWeight <= maxIdealWeight) {
        markerPosition = 25 + ((currentWeight - minIdealWeight) / (maxIdealWeight - minIdealWeight)) * 25;
    } else if (currentWeight <= overweightThreshold) {
        markerPosition = 50 + ((currentWeight - maxIdealWeight) / (overweightThreshold - maxIdealWeight)) * 25;
    } else {
        markerPosition = 75 + Math.min(((currentWeight - overweightThreshold) / (obeseThreshold - overweightThreshold)) * 25, 25);
    }

    document.getElementById('weight-marker').style.left = `${markerPosition}%`;

    // Display BMI value and status
    const bmiInfoElement = document.createElement('div');
    bmiInfoElement.className = 'bmi-info';
    
    // For infants under 24 months, show weight-for-length instead of BMI
    if (totalMonths <= 24) {
        bmiInfoElement.innerHTML = `<strong>Weight-for-length:</strong> ${weightStatus}`;
    } else {
        bmiInfoElement.innerHTML = `<strong>BMI:</strong> ${roundedBmi} (${weightStatus})`;
    }

    // Update food recommendations
    updateFoodRecommendations(weightStatus, totalMonths);

    // Insert BMI/weight-for-length info after the weight header
    const weightHeader = document.querySelector('.weight-header');
    if (weightHeader) {
        const existingBmiInfo = document.querySelector('.bmi-info');
        if (existingBmiInfo) {
            existingBmiInfo.remove();
        }
        weightHeader.insertAdjacentElement('afterend', bmiInfoElement);
    }
}

// Helper function to calculate ideal weight range
function calculateIdealWeight(min, max) {
    return {
        min: min,
        max: max,
        overweight: max * 1.1, // 10% above max healthy weight
        obese: max * 1.2 // 20% above max healthy weight
    };
}

// Function to update food recommendations based on weight status and age
function updateFoodRecommendations(weightStatus, totalMonths) {
    const foodList = document.querySelector('.food-list');
    if (!foodList) return;

    let recommendations = [];
    
    if (totalMonths <= 6) {
        // 0-6 months
        recommendations = [
            'ASI eksklusif adalah makanan terbaik',
            'Konsultasikan dengan dokter untuk suplementasi jika diperlukan',
            'Jangan memberikan makanan padat dulu'
        ];
    } else if (totalMonths <= 12) {
        // 6-12 months
        if (weightStatus === 'underweight') {
            recommendations = [
                'ASI atau susu formula sesuai anjuran dokter',
                'Bubur susu dengan tambahan butter/minyak zaitun',
                'Pure kentang dengan mentega',
                'Alpukat halus',
                'Pure pisang dengan yogurt'
            ];
        } else {
            recommendations = [
                'ASI atau susu formula sesuai anjuran dokter',
                'Bubur nasi halus',
                'Pure buah dan sayur',
                'Yogurt bayi',
                'Biskuit bayi yang dihaluskan'
            ];
        }
    } else {
        // Above 12 months
        if (weightStatus === 'underweight') {
            recommendations = [
                'Bubur nasi dengan daging cincang dan hati ayam',
                'Telur orak-arik dengan keju',
                'Sup krim dengan tambahan butter',
                'Smoothie kaya kalori (susu, pisang, alpukat)',
                'Roti gandum dengan selai kacang'
            ];
        } else if (weightStatus === 'overweight' || weightStatus === 'obese') {
            recommendations = [
                'Sayur-sayuran segar dengan cara masak sehat',
                'Buah-buahan segar dalam porsi sesuai',
                'Protein tanpa lemak (ayam tanpa kulit, ikan)',
                'Susu atau yogurt rendah lemak',
                'Hindari makanan manis dan berminyak'
            ];
        } else {
            recommendations = [
                'Bubur nasi dengan daging cincang dan sayuran',
                'Telur orak-arik dengan sayuran halus',
                'Sup krim labu dengan ayam suwir',
                'Puding susu dan buah segar',
                'Smoothie buah dengan yogurt'
            ];
        }
    }
    
    // Update the food list
    foodList.innerHTML = recommendations.map(item => `<li>${item}</li>`).join('');
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
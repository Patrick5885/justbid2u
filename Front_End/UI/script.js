const STRAPI_URL = 'http://localhost:1338'; // Standard Strapi port
const API_NAME = 'new-imported-models';


// 1. Scroll Animation
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 50) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);
let cars = [];

// --- API FETCHING ---
async function getCarsFromStrapi() {
    console.log("Fetching cars from Strapi...");
    try {
        const response = await fetch(`${STRAPI_URL}/api/${API_NAME}?populate=*`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        
        cars = result.data.map(item => {
            console.log("Processing item:", item); // Check console to see the flat structure

            //  Get images from the Car_Model_Gallery array
            let imageUrl = "https://via.placeholder.com/400x300?text=No+Image";
            if (item.Car_Model_Gallery && item.Car_Model_Gallery.length > 0) {
                // Strapi 5 Media fields are arrays of objects
                imageUrl = STRAPI_URL + item.Car_Model_Gallery[0].url;
            }

            return {
                id: item.id,
                documentId: item.documentId,
                name: item.Model_Name,      
                year: item.Year,            
                price: parseFloat(item.Price) || 0,          
                spec: item.Specifications,  
                grade: item.Grade,          
                mileage: item.Milage,       
                status: item.Model_Status,  
                origin: item.Origin_Country,
                image: imageUrl
            };
        });

        console.log(" Successfully mapped Strapi 5 data:", cars);
        renderCars(cars);
    } catch (error) {
        console.error(" Strapi 5 Mapping Error:", error);
    }
}

// 2. Sample Data, I will use API link post and get JSON file script as data retrieval from WebApi
// const cars = [
//     {
//         id: 1,
//         name: "Toyota Alphard SC",
//         origin: "Japan",
//         year: "2022",
//         price: 328000,
//         spec: "Japan Spec",
//         grade: "5/A",
//         mileage: "18,000 KM",
//         image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500",
//         status: "Available"
//     },
//     {
//         id: 2,
//         name: "BMW 530i M-Sport",
//         origin: "UK",
//         year: "2021",
//         price: 285000,
//         spec: "UK Spec",
//         grade: "4.5/B",
//         mileage: "42,000 KM",
//         image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
//         status: "Sold"
//     },
//     {
//         id: 3,
//         name: "Porsche Taycan",
//         origin: "Japan",
//         year: "2023",
//         price: 590000,
//         spec: "Japan Spec",
//         grade: "S",
//         mileage: "500 KM",
//         image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500",
//         status: "Available"
//     },
//     {
//         id: 4,
//         name: "Porsche Taycan",
//         origin: "Japan",
//         year: "2023",
//         price: 590000,
//         spec: "Japan Spec",
//         grade: "S",
//         mileage: "500 KM",
//         image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500",
//         status: "Available"
//     },
//     {
//         id: 5,
//         name: "Toyota Alphard SC",
//         origin: "Japan",
//         year: "2022",
//         price: 328000,
//         spec: "Japan Spec",
//         grade: "5/A",
//         mileage: "18,000 KM",
//         image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500",
//         status: "Sold"
//     },
// ];

// --- UTILITY FUNCTIONS ---

function renderCars(data) {
    //const grid = document.querySelector('.model-grid');
    const grid = document.getElementById('car-grid');
    if (!grid) {
        console.error("Could not find the car-grid element in HTML");
        return;
    }

    grid.innerHTML = '';

    data.forEach(car => {
        const isSold = car.status === "Sold";
        const cardHTML = `
                <div class="model-card reveal ${isSold ? 'sold-out' : ''}" 
                    data-origin="${car.origin}" 
                    data-year="${car.year}" 
                    data-price="${car.price}">
                    <div class="badge ${isSold ? 'sold-badge' : ''}">
                        ${isSold ? 'SOLD' : car.spec}
                    </div>
                    <img src="${car.image}" alt="${car.name}">
                    <div class="card-info">
                        <span class="year">${car.year}</span>
                        <h3>${car.name}</h3>
                        <p class="price">RM ${car.price.toLocaleString()}</p>
                        <a href="model_details.html?id=${car.documentId}" class="btn-outline">
                            ${isSold ? 'View History' : 'View Details'}
                        </a>
                    </div>
                </div>
            `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
    setTimeout(reveal, 100);
}

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {

    // A. DARK MODE LOGIC (Fixed: Now inside DOMContentLoaded)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        // If we happen to be on the home page (where the toggle exists), check it
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }

    // 2. Listen for changes (Only runs on pages that have the toggle, like Home)
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // if (darkModeToggle) {
    //     // Apply saved theme on page load
    //     if (localStorage.getItem('theme') === 'dark') {
    //         body.classList.add('dark-mode');
    //         darkModeToggle.checked = true;
    //     }

    //     darkModeToggle.addEventListener('change', () => {
    //         if (darkModeToggle.checked) {
    //             body.classList.add('dark-mode');
    //             localStorage.setItem('theme', 'dark');
    //         } else {
    //             body.classList.remove('dark-mode');
    //             localStorage.setItem('theme', 'light');
    //         }
    //     });
    // }

    // B. PAGE LOADING LOGIC
    window.addEventListener('scroll', reveal);
    reveal();

    const path = window.location.pathname;
    if (path.includes('model_details.html')) {
        loadCarDetails();
    } else if (path.includes('stock_car_model.html') || path.includes('home_page.html') || path.endsWith('/') || path.includes('index.html')) {
        console.log("On browsing page - calling Strapi...");
        // renderCars(cars);
        getCarsFromStrapi();
    } else {
        reveal();
    }

    // C. MOBILE NAV
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // This finds the <i> tag inside your menuBtn
            const icon = menuBtn.querySelector('i');

            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // D. SIDEBAR
    const filterBtn = document.getElementById('toggle-filter-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    if (filterBtn) filterBtn.addEventListener('click', () => sidebar.classList.add('active'));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('active'));

    // E. PRICE SLIDER
    const priceInput = document.getElementById('price');
    const priceVal = document.getElementById('price-val');
    if (priceInput && priceVal) {
        priceInput.addEventListener('input', (e) => {
            priceVal.innerText = (e.target.value / 1000) + 'k';
        });
    }

    // F. FILTER EXECUTION
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const searchEl = document.getElementById('model-search');
            const searchTerm = searchEl ? searchEl.value.toLowerCase() : "";

            const yearEl = document.getElementById('year');
            const selectedYear = yearEl ? yearEl.value : "";

            const priceEl = document.getElementById('price');
            const maxPrice = priceEl ? parseInt(priceEl.value) : 1000000;

            const checkedCountries = Array.from(document.querySelectorAll('input[name="origin"]:checked'))
                .map(cb => cb.value);

            const filtered = cars.filter(car => {
                const matchesSearch = car.name.toLowerCase().includes(searchTerm);
                const matchesCountry = checkedCountries.length === 0 || checkedCountries.includes(car.origin);
                const matchesYear = selectedYear === "" || selectedYear === car.year;
                const matchesPrice = car.price <= maxPrice;
                return matchesSearch && matchesCountry && matchesYear && matchesPrice;
            });

            renderCars(filtered);

            if (window.innerWidth <= 992 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    }
});



// --- SLIDER LOGIC FOR DETAILS PAGE ---

let currentSlide = 0;
let slideImages = [];

function updateSlider() {
    const mainImg = document.getElementById('main-view');
    const counter = document.getElementById('img-counter');
    
    if (slideImages.length > 0 && mainImg) {
        mainImg.src = slideImages[currentSlide];
        
        // Update the counter text (e.g., "1 / 5")
        if (counter) {
            counter.textContent = `${currentSlide + 1} / ${slideImages.length}`;
        }

        // Highlight active thumbnail
        document.querySelectorAll('.thumb-item').forEach((thumb, idx) => {
            if (idx === currentSlide) {
                // 1. Add the active class and apply red border
                thumb.classList.add('active');
                thumb.style.border = '2px solid var(--honda-red)';
                thumb.style.opacity = '1';
            } else {
                // 2. Remove the active class and reset border
                thumb.classList.remove('active');
                thumb.style.border = '2px solid transparent';
                thumb.style.opacity = '0.6';
            }
        });
    }
}

// Global functions so the HTML buttons can find them
window.nextImage = () => {
    if (slideImages.length <= 1) return;
    currentSlide = (currentSlide + 1) % slideImages.length;
    updateSlider();
};

window.prevImage = () => {
    if (slideImages.length <= 1) return;
    currentSlide = (currentSlide - 1 + slideImages.length) % slideImages.length;
    updateSlider();
};

window.changeSlide = (i) => {
    currentSlide = i;
    updateSlider();
};

//Model details img gallery slider navigation


async function loadCarDetails() {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id'); // Retrieves the documentId string from the URL
    
    if (!carId) {
        console.warn("No car ID found in URL.");
        return;
    }

    try {
        // Fetch specific car details from Strapi 5 using documentId
        const response = await fetch(`${STRAPI_URL}/api/${API_NAME}/${carId}?populate=*`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch car details: ${response.status}`);
        }

        const result = await response.json();
        const car = result.data; // Strapi 5 structure: result.data contains the fields directly

        if (!car) {
            console.error("Car data is empty or not found.");
            return;
        }

        // --- 1. Map Text Information ---
        const setInfo = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text || "N/A";
        };

        setInfo('car-name', car.Model_Name);
        setInfo('car-year', car.Year);
        setInfo('car-origin', car.Origin_Country);
        setInfo('car-grade', car.Grade);
        setInfo('car-mileage', car.Milage);
        setInfo('car-status', car.Model_Status);
        
        // Handle Price Formatting
        if (car.Price) {
            const formattedPrice = `RM ${parseFloat(car.Price).toLocaleString()}`;
            setInfo('car-price', formattedPrice);
        } else {
            setInfo('car-price', "Contact for Price");
        }

        // --- 2. Setup Dynamic WhatsApp Link ---
        const waBtn = document.getElementById('whatsapp-btn');
        if (waBtn) {
            const message = encodeURIComponent(`Hi JustBid, I'm interested in the ${car.Year} ${car.Model_Name} (Ref: ${car.documentId}). Is it still available?`);
            waBtn.href = `https://wa.me/60123456789?text=${message}`;
            waBtn.target = "_blank";
        }

        // --- 3. Setup Image Gallery ---
        const thumbContainer = document.getElementById('thumbnails');
        
        // Use Car_Model_Gallery as seen in your network response
        if (car.Car_Model_Gallery && car.Car_Model_Gallery.length > 0) {
            // Map the array to full URLs
            slideImages = car.Car_Model_Gallery.map(img => STRAPI_URL + img.url);

            // Generate HTML for thumbnails
            if (thumbContainer) {
                thumbContainer.innerHTML = slideImages.map((src, i) =>
                    `<img src="${src}" 
                          class="thumb-item ${i === 0 ? 'active' : ''}" 
                          onclick="changeSlide(${i})" 
                          alt="Thumbnail ${i + 1}">`
                ).join('');
            }
            
            // Initialize the slider with the first image
            currentSlide = 0;
            updateSlider(); 
        } else {
            // Fallback if no gallery exists
            const mainImg = document.getElementById('main-view');
            if (mainImg) mainImg.src = "https://via.placeholder.com/800x600?text=No+Images+Available";
        }

    } catch (error) {
        console.error("Error loading car details:", error);
        // Optional: Redirect user back or show an error message in the UI
    }
}

window.changeSlide = (i) => { currentSlide = i; updateSlider(); };





// // // Function to handle the Details Page loading
// // async function loadCarDetails() {
// //     const params = new URLSearchParams(window.location.search);
// //     const carId = params.get('id'); // Get the ID from URL

// //     if (!carId) return;

// //     try {
// //         // Fetch specific car with its images
// //         const response = await fetch(`http://localhost:1338/api/new-imported-models/${carId}?populate=*`);
// //         const result = await response.json();

// //         // Strapi returns { data: { id: 1, attributes: {...} } }
// //         const car = result.data.attributes;
// //         const STRAPI_URL = 'http://localhost:1338';

// //         document.title = `${car.name} | JustBid`;

// //         // Helper function for UI
// //         const setInfo = (id, text) => {
// //             const el = document.getElementById(id);
// //             if (el) el.innerText = text;
// //         };
// //         //insert all details

// //         document.title = `${car.name} | JustBid`;
// //         setInfo('car-name', car.name);
// //         setInfo('car-year', car.year);
// //         setInfo('car-price', `RM ${car.price.toLocaleString()}`);
// //         setInfo('car-origin', car.origin);
// //         setInfo('car-grade', car.grade || "4.5");
// //         setInfo('car-mileage', car.mileage || "32,000 KM");
// //         setInfo('car-status', car.status);

// //         const mainImg = document.getElementById('main-view');
// //         if (mainImg && car.thumbnail?.data) {
// //             mainImg.src = STRAPI_URL + car.thumbnail.data.attributes.url;
// //         }

// //         //whatsapp link dynamic
// //         const waMessage = encodeURIComponent(`Hi JustBid, I'm interested in the ${car.year} ${car.name} (RM ${car.price.toLocaleString()}). Is it still available?`);
// //         const waBtn = document.getElementById('whatsapp-btn');
// //         if (waBtn) waBtn.href = `https://wa.me/60123456789?text=${waMessage}`;
// //     } catch (error) {
// //         console.error("Error fetching car details:", error);
// //     }
// }
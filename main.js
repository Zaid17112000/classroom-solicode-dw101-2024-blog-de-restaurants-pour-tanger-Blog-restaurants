const logo = document.querySelector(".logo a");

if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = "./index.html"        
    });
}

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

let restaurantsData;
let filteredRestaurants = [];

fetch('http://localhost:3000/restaurants')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        restaurantsData = data;
        filteredRestaurants = data;
        renderRestaurants(data);
        filterRestaurantsByCuisineNature(data);
    })
    .catch(error => console.error('Error:', error));

function renderRestaurants(restaurants) {
    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';

    restaurants.forEach((restaurant) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${restaurant.picture}" alt="${restaurant.name}">
            <div class="card-content">
                <h2 class="name">${restaurant.name}</h2>
                <p><strong>Cuisine:</strong> ${restaurant.cuisine_nature}</p>
                <p class="notation">⭐ ${restaurant.rating}</p>
                <span class="details-card" onclick="showDetails(${restaurant.id})">Show Details</span>
            </div>
        `;

        cardsContainer.appendChild(card);

        localStorage.setItem(`restaurant_${restaurant.id}`, JSON.stringify(restaurant));
    });
}

function showDetails(id) {
    const restaurant = JSON.parse(localStorage.getItem(`restaurant_${id}`));
    const cardsContainer = document.querySelector('.cards-details');

    if (cardsContainer) {
        cardsContainer.innerHTML = '';
    }

    if (restaurant) {
        window.location.href = "./restaurant.html?card="+encodeURIComponent(JSON.stringify(restaurant));
    }
}

function searchRestaurant(value) {
    const searchTerm = value.toLowerCase();
    const searchedRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm)
    );

    renderRestaurants(searchedRestaurants); // Render only the search results
}

function filterRestaurantsByCuisineNature() {
    const selectElement = document.getElementById('cuisine-filter');

    selectElement.addEventListener('change', function() {
        const selectedValue = selectElement.value;

        if (selectedValue === 'All') {
            filteredRestaurants = restaurantsData; // Reset to all restaurants
        }
        else {
            filteredRestaurants = restaurantsData.filter(restaurant =>
                restaurant.cuisine_nature.includes(selectedValue)
            );
        }

        renderRestaurants(filteredRestaurants);
    });
}
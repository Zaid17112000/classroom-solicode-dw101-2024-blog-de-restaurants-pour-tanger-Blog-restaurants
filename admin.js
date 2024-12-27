const logo = document.querySelector(".logo a");

if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = "./index.html"        
    });
}

let restaurantsData;
let arrayData = [];

fetch('http://localhost:3000/restaurants')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        restaurantsData = data;
        renderRestaurants(data);
        arrayData.push(...data);

        const urlParams = new URLSearchParams(window.location.search);
        const restaurantName = urlParams.get('name'); // Get the 'name' from the URL

        for (const restaurant of arrayData) {
            if (restaurantName === restaurant.name) {
                document.getElementById('name').value = restaurant.name || '';
                document.getElementById('cuisine_nature').value = restaurant.cuisine_nature || '';
                document.getElementById('address').value = restaurant.address || '';
                document.getElementById('phone').value = restaurant.phone || '';
                document.getElementById('rating').value = restaurant.rating || '';
                document.getElementById('picture').value = restaurant.picture || '';
                document.getElementById('website').value = restaurant.site || '';
                return;
            }
        }
    })
    .catch(error => console.error('Error:', error));

let getId = [];

function renderRestaurants(restaurants) {
    const cardsContainer = document.querySelector('.cards');

    if (cardsContainer) {
        cardsContainer.innerHTML = '';
    
        cardsContainer.innerHTML = `
            <table class="restaurant-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th class="cuisine">Cuisine</th>
                        <th>Rating</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    
        const tbody = document.querySelector('tbody');
    
        for (let i = 0; i < restaurants.length; i++) {
            const restaurant = restaurants[i];
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${restaurant.picture}" alt="${restaurant.name}" /></td>
                <td>${restaurant.name}</td>
                <td>${restaurant.cuisine_nature}</td>
                <td>⭐ ${restaurant.rating}</td>
                <td><span class="details-card" onclick="showDetails(${restaurant.id})">Show Details</span></td>
                <td class="btns">
                    <button class="delete" data-name="${restaurant.name}">Delete</button>
                    <a href="./_update.html?name=${restaurant.name}"><button class="update">Update</button></a>
                </td>
            `;
    
            tbody.appendChild(row);

            // Store each restaurant ID in the global array
            getId.push(restaurant.id);
    
            localStorage.setItem(`restaurant_${restaurant.id}`, JSON.stringify(restaurant));
        }
    };
    // Attach event listeners to delete buttons
    const deleteButton = document.querySelectorAll(".delete");
    deleteButton.forEach(button => {
        button.addEventListener("click", function () {
            const restaurantName = button.getAttribute("data-name");
            deleteRestaurant(restaurantName);
        });
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
    const cardsContainer = document.querySelector('.cards');
    cardsContainer.innerHTML = '';

    cardsContainer.innerHTML = `
        <table class="restaurant-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th class="cuisine">Cuisine</th>
                    <th>Rating</th>
                    <th>Details</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

    const tbody = document.querySelector('tbody');

    if (value.trim() === '') {
        renderRestaurants(restaurantsData);
    }
    else {
        for (let i = 0; i < restaurantsData.length; i++) {
            if (restaurantsData[i].name.toLowerCase().includes(value.toLowerCase())) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${restaurantsData[i].picture}" alt="${restaurantsData[i].name}" /></td>
                    <td>${restaurantsData[i].name}</td>
                    <td>${restaurantsData[i].cuisine_nature}</td>
                    <td>⭐ ${restaurantsData[i].rating}</td>
                    <td><span class="details-card" onclick="showDetails(${restaurantsData[i].id})">Show Details</span></td>
                    <td class="btns">
                        <button class="delete" data-name="${restaurantsData[i].name}">Delete</button>
                    </td>
                `;

                tbody.appendChild(row);
            }
        }
    }
}

/***************************************/

const cardForm = document.getElementById('cardForm');

if (cardForm) {
    cardForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const cuisine_nature = document.getElementById('cuisine_nature').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const rating = document.getElementById('rating').value;
        const picture = document.getElementById('picture').value;
    
        // Prepare the data to send in the POST request
        const cardData = {
            name: name,
            cuisine_nature: cuisine_nature,
            address: address,
            phone: phone,
            rating: rating,
            picture: picture
        };
    
        // Send POST request to the server
        fetch('http://localhost:3000/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }
            return response.json();
        })
        .then(data => {
            alert('Restaurant added successfully!');
            console.log('Restaurant added:', data);
    
            document.getElementById('cardForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
}

function deleteRestaurant(name) {
    fetch(`http://localhost:3000/restaurants/${name}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Restaurant deleted successfully!');
        } else {
            return response.text().then(error => {
                throw new Error(error);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete restaurant. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const updateForm = document.getElementById('updateForm');
    
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const urlParams = new URLSearchParams(window.location.search);
            const restaurantName = urlParams.get('name');
        
            // Get the values from the form
            const name = document.getElementById('name').value.trim();
            const cuisineNature = document.getElementById('cuisine_nature').value.trim();
            const address = document.getElementById('address').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const rating = document.getElementById('rating').value.trim();
            const picture = document.getElementById('picture').value.trim();
            const website = document.getElementById('website').value.trim();

            const ratingInput = document.getElementById("rating");

            ratingInput.addEventListener("input", (event) => {
              const value = event.target.value;
              !/^\d+(\.\d{1})?$/.test(value);
            });
        
            const updatedRestaurant = {
                name,
                cuisine_nature: cuisineNature,
                address,
                phone,
                rating,
                picture,
                site: website
            };
        
            fetch(`http://127.0.0.1:3000/restaurants/${restaurantName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRestaurant)
            })
            .then(response => {
                console.log('Raw Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Restaurant updated successfully:', data);
                alert('Restaurant updated successfully!');
            })
            .catch(error => {
                console.error('Error:', error);
            })
        });
    }
})
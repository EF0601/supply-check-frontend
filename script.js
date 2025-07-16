//! remove for production
const authcode = null;

let currentUserData = {
    name: "",
    email: "",
    households: [],
    authToken: ""
};

let currentHouseHoldData = {
    name: "",
    members: [],
    items: new Map(), // Using Map to store items with their quantities
    owner: ""
};

// Get overlay elements
const householdOverlay = document.getElementById('householdOverlay');
const loginOverlay = document.getElementById('loginOverlay');
const registerOverlay = document.getElementById('registerOverlay');

// Household Manager functionality
document.getElementById('openHouseholdManager').onclick = () => {
    householdOverlay.style.display = 'flex';
};

function closeHouseholdPopup() {
    householdOverlay.style.display = 'none';
}

// Close popup when clicking outside
householdOverlay.onclick = (e) => {
    if (e.target === householdOverlay) {
        closeHouseholdPopup();
    }
};

// Close popups with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeHouseholdPopup();
        closePopups();
    }
});

// Add click handlers for overlay backgrounds
loginOverlay.onclick = (e) => {
    if (e.target === loginOverlay) {
        closePopups();
    }
};

registerOverlay.onclick = (e) => {
    if (e.target === registerOverlay) {
        closePopups();
    }
};

// Add click handlers for household items
document.addEventListener('DOMContentLoaded', () => {
    const householdItems = document.querySelectorAll('.household-item');
    householdItems.forEach(item => {
        item.onclick = () => {
            // alert(`Selected household: ${item.textContent}`);
            closeHouseholdPopup();
            getHousehold(item.textContent);
        };
    });

    // Create household button handler
    document.querySelector('.create-household-btn').onclick = () => {
        const householdName = prompt('Enter household name:');
        if (householdName) {
            // For now, just create a mock household and show main app
            currentHouseHoldData.name = householdName;
            currentHouseHoldData.members = [currentUserData.email];
            currentHouseHoldData.items = new Map();
            currentHouseHoldData.owner = currentUserData.email;

            closeHouseholdPopup();
            showMainApp();
        }
    };
});

// Login/Register functionality
// document.getElementById('openLogin').onclick = () => {
//     loginOverlay.style.display = 'flex';
// };
function showRegister() {
    loginOverlay.style.display = 'none';
    registerOverlay.style.display = 'flex';
}
function showLogin() {
    registerOverlay.style.display = 'none';
    loginOverlay.style.display = 'flex';
}
function closePopups() {
    loginOverlay.style.display = 'none';
    registerOverlay.style.display = 'none';
}

showLogin(); // Commented out to show welcome screen instead



function login(paramEmail, paramPswd) {
    const loginErrorMessage = document.getElementById('loginErrorMessage');

    const email = paramEmail || document.querySelector('input[name="loginEmail"]').value;
    const pswd = paramPswd || document.querySelector('input[name="loginPassword"]').value;

    if (email.length === 0 || pswd.length === 0) {
        loginErrorMessage.textContent = 'Please fill out both fields';
        return;
    }

    console.log(JSON.stringify({
        email: email,
        pswd: pswd
    }));
    fetch(`https://login-lrpk2e3lda-uc.a.run.app?auth=${authcode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pswd: pswd
        })
    })
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(data => {
            currentUserData.email = email;
            currentUserData.name = data.user || "User";

            document.getElementById('welcomeUserScreenName').textContent = currentUserData.name;
            currentUserData.households = data.households || [];
            closePopups();
            // update household list
            const householdList = document.getElementById('householdList');
            householdList.innerHTML = ''; // Clear existing items
            currentUserData.households.forEach(household => {
                const item = document.createElement('div');
                item.className = 'household-item';
                item.textContent = household;
                item.onclick = () => {
                    closeHouseholdPopup();
                    getHousehold(household);
                };
                householdList.appendChild(item);
            });
        })
        .catch(error => {
            console.log(error);
            // console.log(error && error.response && error.response.status);
            if (error) {
                const errorCode = String(error).substring(0, 10);
                console.log(errorCode);
                switch (errorCode) {
                    case "Error: 401":
                        loginErrorMessage.textContent = 'Wrong email or password. Please try again.';
                        console.log("Login failed: 401");
                        break;
                    case "Error: 500":
                        loginErrorMessage.textContent = 'Server error. Please try later.';
                        break;
                    case "Error: 404":
                        loginErrorMessage.textContent = 'User not found. Register?';
                        break;
                    default:
                        loginErrorMessage.textContent = 'Login failed. Please try again.';
                        break;
                }
            } else {
                loginErrorMessage.textContent = 'Login failed. Please try again.';
            }
        });
}

function register() {
    const registerErrorMessage = document.getElementById('registerErrorMessage');

    const email = document.querySelector('input[name="registerEmail"]').value;
    const pswd = document.querySelector('input[name="registerPassword"]').value;
    const user = document.querySelector('input[name="registerUsername"]').value;

    if (email.length === 0 || pswd.length === 0 || user.length === 0) {
        registerErrorMessage.textContent = 'Please fill out all fields';
        return;
    }

    console.log(JSON.stringify({
        email: email,
        pswd: pswd,
        user: user
    }));
    fetch(`https://register-lrpk2e3lda-uc.a.run.app?auth=${authcode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pswd: pswd,
            user: user
        })
    })
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(data => {
            currentUserData.email = email;
            currentUserData.name = data.user || "User";

            document.getElementById('welcomeUserScreenName').textContent = currentUserData.name;
            registerErrorMessage.textContent = "Trying to log you in...";
            registerErrorMessage.style.color = "green";
            login(email, pswd); // Call login to set user data
        })
        .catch(error => {
            console.log(error);
            if (error) {
                const errorCode = String(error).substring(0, 10);
                console.log(errorCode);
                switch (errorCode) {
                    case "Error: 401":
                        loginErrorMessage.textContent = 'Wrong email or password. Please try again.';
                        break;
                    case "Error: 500":
                        loginErrorMessage.textContent = 'Server error. Please try later.';
                        break;
                    case "Error: 404":
                        loginErrorMessage.textContent = 'User not found. Register?';
                        break;
                    default:
                        loginErrorMessage.textContent = 'Registration failed. Please try again.';
                        break;
                }
            } else {
                loginErrorMessage.textContent = 'Registration failed. Please try again.';
            }
        });
}

function getHousehold(household) {
    console.log(`Getting details for household: ${household}`);
    fetch(`https://gethousehold-lrpk2e3lda-uc.a.run.app?auth=${authcode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requester: currentUserData.email,
            householdName: household
        })
    })
        .then(response => {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(data => {
            currentHouseHoldData.name = data.name || "";
            currentHouseHoldData.members = data.members || [];
            currentHouseHoldData.items = new Map(Object.entries(data.items || {}));
            currentHouseHoldData.owner = data.owner || "";
            console.log("Household details:", currentHouseHoldData);

            // Show the main app after loading household data
            showMainApp();
        })
        .catch(error => {
            console.error("Error fetching household details:", error);
        });
}

// Menu navigation functionality
function showMenuPage(pageNumber) {
    // Remove active class from all nav buttons and pages
    document.querySelectorAll('.menu-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.menu-page').forEach(page => page.classList.remove('active'));

    // Add active class to selected button and page
    document.getElementById(`menuBtn${pageNumber}`).classList.add('active');
    document.getElementById(`menuPage${pageNumber}`).classList.add('active');
}

// Function to show welcome screen and hide main app
function showWelcomeScreen() {
    // update household
    updateHousehold();
    // // Reset current household data
    // currentHouseHoldData = {
    //     name: "",
    //     members: [],
    //     items: new Map(), // Using Map to store items with their quantities
    //     owner: ""
    // };

    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
}

// Function to show main app and hide welcome screen
function showMainApp() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    updateDisplays(); // Update the item list when showing main app
}

// Function to update item quantity
function updateItemQuantity(itemName, change) {
    if (currentHouseHoldData.items.has(itemName)) {
        const currentQuantity = currentHouseHoldData.items.get(itemName);
        const newQuantity = Math.max(0, currentQuantity + change); // Don't allow negative quantities
        currentHouseHoldData.items.set(itemName, newQuantity);
        updateDisplays(); // Refresh the display
    }
}

// Function to populate the items list from household data
function updateDisplays() {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = ''; // Clear existing items

    if (currentHouseHoldData.items.size === 0) {
        // Show message if no items
        const noItemsMessage = document.createElement('div');
        noItemsMessage.className = 'no-items-message';
        noItemsMessage.innerHTML = `
            <p>No items in this household yet.</p>
            <button class="menu-action-btn" onclick="addNewItem()">Add Your First Item</button>
        `;
        itemsList.appendChild(noItemsMessage);
        return;
    }

    // Create item rows for each item in the map
    currentHouseHoldData.items.forEach((quantity, itemName) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';

        itemRow.innerHTML = `
            <div class="item-title">${itemName}</div>
            <div class="item-controls">
                <button class="item-btn subtract" onclick="updateItemQuantity('${itemName}', -1)">−</button>
                <div class="item-quantity">${quantity}</div>
                <button class="item-btn add" onclick="updateItemQuantity('${itemName}', 1)">+</button>
            </div>
        `;

        itemsList.appendChild(itemRow);
    });
}

// Function to add a new item (placeholder)
function addItem() {
    const itemName = prompt('Enter item name:');
    if (itemName && itemName.trim()) {
        currentHouseHoldData.items.set(itemName.trim(), 1);
        updateDisplays();
    }
}

function updateHousehold() {
    currentHouseHoldData.items = Object.fromEntries(currentHouseHoldData.items); // Convert Map to object for JSON serialization

    fetch("https://updatehousehold-lrpk2e3lda-uc.a.run.app?auth=" + authcode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: currentUserData.email,
            householdName: currentHouseHoldData.name,
            updates: currentHouseHoldData // Remove the outer braces
        })
    })
        .then(response => {
            // console.log(JSON.stringify(currentHouseHoldData));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Household updated successfully:", data);
        })
        .catch(error => {
            console.error("Error updating household:", error);
        });
}

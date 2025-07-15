//! remove for production
const authcode = null;

const loginOverlay = document.getElementById('loginOverlay');
const registerOverlay = document.getElementById('registerOverlay');
document.getElementById('openLogin').onclick = () => {
    loginOverlay.style.display = 'flex';
};
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

showLogin();

const loginErrorMessage = document.getElementById('loginErrorMessage');

function login(){
    const email = document.querySelector('input[name="loginEmail"]').value;
    const pswd = document.querySelector('input[name="loginPassword"]').value;

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
        alert(`Login successful: ${data.message}`);
        closePopups();
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

let weather = {
  apiKey: "2edb891504a4aba85d525f7a119893c4",
  fetchWeather: function (city) {
    const token = localStorage.getItem('token'); // Get the token from localStorage if available
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}; // Attach token if logged in

    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          this.displayWeather(data);
        } else {
          alert("City not found. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please try again later.");
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { lon, lat } = data.coord;
    const { icon, description } = data.weather[0];
    const { temp, feels_like, temp_min, temp_max, pressure, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerHTML = "Weather in " + name;
    document.querySelector(".long").innerHTML = "( " + lon + " , " + lat + " )";
    document.querySelector(".icon").src =
      "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".feelslike").innerText =
      "Feels like: " +
      feels_like +
      "°C  ||  Max: " +
      temp_max +
      "°C  ||  Min: " +
      temp_min +
      "°C";
    document.querySelector(".pressure").innerText =
      "Pressure: " +
      pressure +
      "pa  ||  Humidity: " +
      humidity +
      "%  ||  Wind: " +
      speed +
      "km/h";
  },
  search: function () {
    const city = document.querySelector(".search-bar").value;
    if (city) {
      this.fetchWeather(city);
    } else {
      alert("Please enter a city name.");
    }
  },
};

// Weather search functionality
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

// User Authentication Functionality
const usernameDisplay = document.getElementById("username");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const closeLoginModal = document.getElementById("close-login");
const closeRegisterModal = document.getElementById("close-register");
const registerLink = document.getElementById("register-link");

let userLoggedIn = false;

// Check for existing login session
document.addEventListener("DOMContentLoaded", () => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername) {
    usernameDisplay.innerText = storedUsername;
    userLoggedIn = true;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
  } else {
    usernameDisplay.innerText = "Guest";
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
  }
});

// Show login modal
loginBtn.addEventListener("click", function () {
  loginModal.style.display = "block";
});

// Close login modal
closeLoginModal.addEventListener("click", function () {
  loginModal.style.display = "none";
});

// Show register modal when link is clicked
registerLink.addEventListener("click", function () {
  loginModal.style.display = "none";
  registerModal.style.display = "block";
});

// Close register modal
closeRegisterModal.addEventListener("click", function () {
  registerModal.style.display = "none";
  loginModal.style.display = "block";
});

// Register user
async function register() {
  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Registration successful!');
      registerModal.style.display = 'none';
    } else {
      alert(data.message || "Registration failed.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Registration failed. Please try again.");
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('username', username); // Persist login session
      localStorage.setItem('token', data.token);  // Save token for API requests
      loginModal.style.display = 'none';
      document.getElementById('username').textContent = username;
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
  }
}

// Logout user
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("username");
  localStorage.removeItem("token");  // Remove token
  usernameDisplay.innerText = "Guest";
  loginBtn.style.display = "inline";
  logoutBtn.style.display = "none";
});

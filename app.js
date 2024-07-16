const apiKey = "a84356141c9bb1cf1517842b523773fc";

const input = document.querySelector("input"),
  btn = document.querySelector("button"),
  loading = document.getElementById("loading"),
  output = document.querySelector(".output");

btn.addEventListener("click", getWeather);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather(e);
  }
});

let searchHistory = [];

// Load search history from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.backgroundImage = "url('./img/cloudly.jpg')";
  loadSearchHistory();
  updateSearchHistoryUI();
});

function getWeather(e) {
  if (e) {
    e.preventDefault();
  }
  const city = input.value.trim();
  // console.log(city);

  if (city === "" || !city) {
    alert("Please enter a city name");
    return;
  }

  clearResult()
  loading.style.display = "block";
  output.classList.remove("show");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(url)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Something went Wrong!");
    }
    return res.json();
  })
    .then((data) => {
      // console.log(data);
      updateWeather(data);
      addToSearchHistory(city);
      showOutput();
    })
    .catch((err) => {
   document.getElementById('city').textContent = `${err} Please try again..`
    })
    .finally(() => {
      loading.style.display = "none";
      input.value = "";
    });
}

function clearResult() {
  document.getElementById("temp").textContent = "";
  document.getElementById("city").textContent = "";
  document.querySelector("#icon").innerHTML = "";
  document.getElementById("wind").textContent = "";
  document.getElementById("humidity").textContent = "";
  document.getElementById("time").textContent = "";
}


function updateWeather(data) {
  const temp = (data.main.temp - 273.15).toFixed(1);
  // console.log("Temp", temp);
  document.getElementById("temp").textContent = `${temp}°C`;
  document.getElementById("city").textContent = `${data.name}`;
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  document.querySelector(
    "#icon"
  ).innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt=""/><h2>${description}</h2>`;
  updateImg(data.weather[0].main);

  const wind = data.wind.speed;
  const humidity = data.main.humidity;
  document.getElementById("wind").textContent = `${wind} km/h`;
  document.getElementById("humidity").textContent = `${humidity} %`;

  const timeElement = document.getElementById("time");
  const dataTime = data.dt;
  // console.log(dataTime);
  const date = new Date(dataTime * 1000);
  const timeString = date.toLocaleTimeString();
  timeElement.textContent = `${timeString}`;
}
function updateImg(weatherMain) {
  const imgPaths = {
    Clear: "./img/clearsky.jpg",
    Clouds: "./img/brokencloud.jpg",
    Rain: "./img/rainy.jpg",
    Snow: "./img/snow.jpg",
    Thunderstorm: "./img/thunderstorm.jpg",
    Drizzle: "./img/rainy.jpg",
    Mist: "./img/haze.jpg",
    Smoke: "./img/haze.jpg",
    Haze: "./img/haze.jpg",
    Dust: "./img/haze.jpg",
    Fog: "./img/haze.jpg",
    Sand: "./img/haze.jpg",
    Ash: "./img/haze.jpg",
    Squall: "./img/wind.jpg",
    Tornado: "./img/wind.jpg",
  };

  const imgPath = imgPaths[weatherMain] || "./img/cloudly.jpg";
  // console.log(imgPath);
  document.body.style.backgroundImage = `url(${imgPath})`;
 
}

function addToSearchHistory(city) {
  searchHistory = searchHistory.filter(
    (item) => item.toLowerCase() !== city.toLowerCase()
  );
  searchHistory.unshift(city);
  searchHistory = searchHistory.slice(0, 5);
  updateSearchHistoryUI();
  saveSearchHistory();
}

function updateSearchHistoryUI() {
  const historyList = document.querySelector(".output ul");
  historyList.innerHTML = "";

  searchHistory.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      input.value = city;
      getWeather(new Event("click"));
    });
    historyList.appendChild(li);
  });
}

function saveSearchHistory() {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

function loadSearchHistory() {
  const storedHistory = localStorage.getItem("weatherSearchHistory");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
}

function showOutput() {
  setTimeout(() => {
    output.classList.add("show");
  }, 100);
}

var map = L.map("map", {
  zoomControl: false,
});

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}{r}.png",
  {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
).addTo(map);

var africaBounds = [
  [-35.0, -18.0],
  [38.0, 52.0],
];
map.fitBounds(africaBounds);

var countries = [
  { name: "Algeria", lat: 28.0, lng: 2.0 },
  { name: "Angola", lat: -11.2, lng: 17.9 },
  { name: "Benin", lat: 6.3, lng: 2.3 },
  { name: "Botswana", lat: -22.3, lng: 24.7 },
  { name: "Burkina Faso", lat: 12.2, lng: -1.4 },
  { name: "Burundi", lat: -3.5, lng: 30.0 },
  { name: "Cameroon", lat: 3.9, lng: 11.5 },
  { name: "Central African Republic", lat: 7.0, lng: 20.0 },
  { name: "Chad", lat: 12.1, lng: 16.0 },
  { name: "Côte d'Ivoire", lat: 7.5, lng: -5.5 },
  { name: "DR Congo", lat: -2.5, lng: 23.7 },
  { name: "Djibouti", lat: 11.6, lng: 43.1 },
  { name: "Egypt", lat: 26.8, lng: 30.8 },
  { name: "Equatorial Guinea", lat: 1.6, lng: 10.5 },
  { name: "Eritrea", lat: 15.3, lng: 38.9 },
  { name: "Ethiopia", lat: 9.0, lng: 38.7 },
  { name: "Gabon", lat: -0.5, lng: 11.6 },
  { name: "The Gambia", lat: 13.4, lng: -16.7 },
  { name: "Ghana", lat: 5.6, lng: -0.2 },
  { name: "Guinea", lat: 9.5, lng: -13.7 },
  { name: "Guinea‑Bissau", lat: 12.0, lng: -15.0 },
  { name: "Kenya", lat: -0.3, lng: 36.8 },
  { name: "Lesotho", lat: -29.6, lng: 28.2 },
  { name: "Liberia", lat: 6.3, lng: -9.5 },
  { name: "Libya", lat: 26.8, lng: 17.2 },
  { name: "Madagascar", lat: -18.8, lng: 46.9 },
  { name: "Malawi", lat: -13.3, lng: 34.3 },
  { name: "Mali", lat: 17.6, lng: -3.9 },
  { name: "Mauritania", lat: 21.0, lng: -10.0 },
  { name: "Morocco", lat: 31.8, lng: -7.1 },
  { name: "Mozambique", lat: -18.8, lng: 35.5 },
  { name: "Namibia", lat: -22.0, lng: 17.1 },
  { name: "Niger", lat: 17.6, lng: 8.1 },
  { name: "Nigeria", lat: 9.1, lng: 7.5 },
  { name: "Republic of the Congo", lat: -0.2, lng: 15.8 },
  { name: "Rwanda", lat: -1.9, lng: 29.9 },
  { name: "Senegal", lat: 14.5, lng: -14.4 },
  { name: "Sierra Leone", lat: 8.6, lng: -11.8 },
  { name: "Somalia", lat: 5.1, lng: 46.4 },
  { name: "South Africa", lat: -30.6, lng: 22.9 },
  { name: "South Sudan", lat: 7.9, lng: 30.5 },
  { name: "Sudan", lat: 15.5, lng: 30.2 },
  { name: "Swaziland (Eswatini)", lat: -26.5, lng: 31.5 },
  { name: "Tanzania", lat: -6.4, lng: 34.9 },
  { name: "Togo", lat: 8.6, lng: 0.8 },
  { name: "Tunisia", lat: 34.0, lng: 9.0 },
  { name: "Uganda", lat: 1.4, lng: 32.3 },
  { name: "Zambia", lat: -13.1, lng: 27.8 },
  { name: "Zimbabwe", lat: -19.0, lng: 29.2 },
];

let score = 0;
let streak = 0;
let mistakes = 0;
let totalClicks = 0;

let remainingCountries = [...countries];

let currentCountry = null;
const tolerance = 3.5;

const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");
const infoEl = document.getElementById("info");

function pickCountry() {
  if (remainingCountries.length === 0) {
    showEndScreen();
    return;
  }

  const index = Math.floor(Math.random() * remainingCountries.length);
  currentCountry = remainingCountries[index];

  infoEl.innerHTML = `Where is <b>${currentCountry.name}</b>?`;
  mistakes = 0;

  if (messageEl.textContent === "❌ Wrong! Try again.") {
    messageEl.textContent = "Good job!";
  }
}

map.on("click", function (e) {
  totalClicks++;
  const dist = Math.sqrt(
    Math.pow(e.latlng.lat - currentCountry.lat, 2) +
      Math.pow(e.latlng.lng - currentCountry.lng, 2),
  );

  if (dist < tolerance) {
    L.circle([e.latlng.lat, e.latlng.lng], {
      radius: 50000,
      color: "green",
    })
      .addTo(map)
      .bindPopup(`✅ Correct! ${currentCountry.name}`)
      .openPopup();

    score++;
    streak++;
    scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;

    remainingCountries = remainingCountries.filter(
      (c) => c.name !== currentCountry.name,
    );

    pickCountry();
  } else {
    mistakes++;

    score = Math.max(0, score - 1);
    streak = 0;
    scoreEl.textContent = `Score: ${score} | Streak: ${streak}`;
    messageEl.textContent = `❌ Wrong! Try again.`;

    const wrongCircle = L.circle([e.latlng.lat, e.latlng.lng], {
      radius: 50000,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.6,
      opacity: 1,
    }).addTo(map);

    setTimeout(() => {
      let opacity = 1;
      const fadeInterval = setInterval(() => {
        opacity -= 0.05;
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          map.removeLayer(wrongCircle);
        } else {
          wrongCircle.setStyle({
            opacity: opacity,
            fillOpacity: opacity * 0.6,
          });
        }
      }, 50);
    }, 5000);

    if (mistakes >= 3) {
      hintPulse(currentCountry.lat, currentCountry.lng);
    }
  }
});

function hintPulse(lat, lng) {
  const pulse = L.circle([lat, lng], {
    radius: 100000,
    color: "#00bcd4",
    weight: 1,
    fillOpacity: 0,
    opacity: 0.2,
  }).addTo(map);

  let radius = 100000;
  let opacity = 0.8;

  const pulseInterval = setInterval(() => {
    radius += 25000;
    opacity -= 0.05;

    if (opacity <= 0) {
      clearInterval(pulseInterval);
      map.removeLayer(pulse);
    } else {
      pulse.setStyle({ opacity });
      pulse.setRadius(radius);
    }
  }, 60);
}

function showEndScreen() {
  const endScreen = document.getElementById("endScreen");
  const finalStats = document.getElementById("finalStats");

  const accuracy = totalClicks > 0 ? Math.round((54 / totalClicks) * 100) : 0;

  finalStats.innerHTML = `
    <strong>Final Score:</strong> ${score}<br>
    <strong>Total Clicks:</strong> ${totalClicks}<br>
    <strong>Accuracy:</strong> ${accuracy}%
  `;

  endScreen.classList.remove("hidden");

  // Trigger payment for parent/student
  const sats = score; // 1 sat per point
  window.payForScore(sats);
}

document.addEventListener("DOMContentLoaded", () => {
  const scoreEl = document.getElementById("score");
  const messageEl = document.getElementById("message");
  const infoEl = document.getElementById("info");

  signInWithLightningAddress();
  pickCountry();

  document.getElementById("restartBtn").addEventListener("click", () => {
    score = 0;
    streak = 0;
    mistakes = 0;
    totalClicks = 0;
    remainingCountries = [...countries];

    scoreEl.textContent = "Score: 0 | Streak: 0";
    messageEl.textContent = "Welcome!";
    document.getElementById("endScreen").classList.add("hidden");

    pickCountry();
  });
});

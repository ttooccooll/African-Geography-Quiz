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
  { name: "Algeria", lat: 28.0, lng: 2.0, capital: "Algiers" },
  { name: "Angola", lat: -11.2, lng: 17.9, capital: "Luanda" },
  { name: "Benin", lat: 6.3, lng: 2.3, capital: "Porto-Novo" },
  { name: "Botswana", lat: -22.3, lng: 24.7, capital: "Gaborone" },
  { name: "Burkina Faso", lat: 12.2, lng: -1.4, capital: "Ouagadougou" },
  { name: "Burundi", lat: -3.5, lng: 30.0, capital: "Gitega" },
  { name: "Cameroon", lat: 3.9, lng: 11.5, capital: "Yaoundé" },
  { name: "Central African Republic", lat: 7.0, lng: 20.0, capital: "Bangui" },
  { name: "Chad", lat: 12.1, lng: 16.0, capital: "N'Djamena" },
  { name: "Côte d'Ivoire", lat: 7.5, lng: -5.5, capital: "Yamoussoukro" },
  { name: "Democratic Republic of the Congo (DRC)", lat: -2.5, lng: 23.7, capital: "Kinshasa" },
  { name: "Djibouti", lat: 11.6, lng: 43.1, capital: "Djibouti" },
  { name: "Egypt", lat: 26.8, lng: 30.8, capital: "Cairo" },
  { name: "Equatorial Guinea", lat: 1.6, lng: 10.5, capital: "Malabo" },
  { name: "Eritrea", lat: 15.3, lng: 38.9, capital: "Asmara" },
  { name: "Ethiopia", lat: 9.0, lng: 38.7, capital: "Addis Ababa" },
  { name: "Gabon", lat: -0.5, lng: 11.6, capital: "Libreville" },
  { name: "The Gambia", lat: 13.4, lng: -16.7, capital: "Banjul" },
  { name: "Ghana", lat: 5.6, lng: -0.2, capital: "Accra" },
  { name: "Guinea", lat: 9.5, lng: -13.7, capital: "Conakry" },
  { name: "Guinea‑Bissau", lat: 12.0, lng: -15.0, capital: "Bissau" },
  { name: "Kenya", lat: -0.3, lng: 36.8, capital: "Nairobi" },
  { name: "Lesotho", lat: -29.6, lng: 28.2, capital: "Maseru" },
  { name: "Liberia", lat: 6.3, lng: -9.5, capital: "Monrovia" },
  { name: "Libya", lat: 26.8, lng: 17.2, capital: "Tripoli" },
  { name: "Madagascar", lat: -18.8, lng: 46.9, capital: "Antananarivo" },
  { name: "Malawi", lat: -13.3, lng: 34.3, capital: "Lilongwe" },
  { name: "Mali", lat: 17.6, lng: -3.9, capital: "Bamako" },
  { name: "Mauritania", lat: 21.0, lng: -10.0, capital: "Nouakchott" },
  { name: "Morocco", lat: 31.8, lng: -7.1, capital: "Rabat" },
  { name: "Mozambique", lat: -18.8, lng: 35.5, capital: "Maputo" },
  { name: "Namibia", lat: -22.0, lng: 17.1, capital: "Windhoek" },
  { name: "Niger", lat: 17.6, lng: 8.1, capital: "Niamey" },
  { name: "Nigeria", lat: 9.1, lng: 7.5, capital: "Abuja" },
  { name: "Republic of the Congo (RC)", lat: -0.2, lng: 15.8, capital: "Brazzaville" },
  { name: "Rwanda", lat: -1.9, lng: 29.9, capital: "Kigali" },
  { name: "Senegal", lat: 14.5, lng: -14.4, capital: "Dakar" },
  { name: "Sierra Leone", lat: 8.6, lng: -11.8, capital: "Freetown" },
  { name: "Somalia", lat: 5.1, lng: 46.4, capital: "Mogadishu" },
  { name: "South Africa", lat: -30.6, lng: 22.9, capital: "Pretoria" },
  { name: "South Sudan", lat: 7.9, lng: 30.5, capital: "Juba" },
  { name: "Sudan", lat: 15.5, lng: 30.2, capital: "Khartoum" },
  { name: "Swaziland (Eswatini)", lat: -26.5, lng: 31.5, capital: "Mbabane" },
  { name: "Tanzania", lat: -6.4, lng: 34.9, capital: "Dodoma" },
  { name: "Togo", lat: 8.6, lng: 0.8, capital: "Lomé" },
  { name: "Tunisia", lat: 34.0, lng: 9.0, capital: "Tunis" },
  { name: "Uganda", lat: 1.4, lng: 32.3, capital: "Kampala" },
  { name: "Zambia", lat: -13.1, lng: 27.8, capital: "Lusaka" },
  { name: "Zimbabwe", lat: -19.0, lng: 29.2, capital: "Harare" },
];

let score = 0;
let streak = 0;
let mistakes = 0;
let totalClicks = 0;

let remainingCountries = [...countries];

let currentCountry = null;
const tolerancePerCountry = {
  "Mozambique": 6,
  "Chad": 6,
  "Guinea‑Bissau": 4,
  "Morocco": 5,
  "Rwanda": 2,
  "Burundi": 2,
};

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

  if (capitalMode) {
    infoEl.innerHTML = `Which country's capital is <b>${currentCountry.capital}</b>?`;
  } else {
    infoEl.innerHTML = `Where is <b>${currentCountry.name}</b>?`;
  }

  mistakes = 0;

  if (messageEl.textContent === "❌ Wrong! Try again.") {
    messageEl.textContent = "Good job!";
  }
}

map.on("click", function (e) {
  totalClicks++;
  const tolerance = tolerancePerCountry[currentCountry.name] || 3.5;
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

document.addEventListener("DOMContentLoaded", () => {
  const scoreEl = document.getElementById("score");
  const messageEl = document.getElementById("message");
  const infoEl = document.getElementById("info");

  window.showLightningModal();

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
    document.getElementById("paymentQR").classList.add("hidden");

    window.showLightningModal();

    pickCountry();
  });
});

const faqBtn = document.getElementById("faqBtn");
const paymentsBtn = document.getElementById("paymentsBtn");
const capitalModeBtn = document.getElementById("capitalModeBtn");

const faqPopup = document.getElementById("faqPopup");
const paymentsPopup = document.getElementById("paymentsPopup");

document.querySelectorAll(".closePopup").forEach(btn => {
  btn.addEventListener("click", e => {
    e.target.closest(".popup").classList.add("hidden");
  });
});

faqBtn.addEventListener("click", () => {
  faqPopup.classList.toggle("hidden");
  paymentsPopup.classList.add("hidden");
});

paymentsBtn.addEventListener("click", () => {
  paymentsPopup.classList.toggle("hidden");
  faqPopup.classList.add("hidden");
});

let capitalMode = false;
capitalModeBtn.addEventListener("click", () => {
  capitalMode = !capitalMode;
  capitalModeBtn.textContent = capitalMode ? "🏛️ Capital Mode ON" : "🏛️ Capital Mode";
});


async function getInvoiceFromLightningAddress(address, sats) {
  const [name, domain] = address.split("@");
  const lnurlpUrl = `https://${domain}/.well-known/lnurlp/${name}`;

  const lnurlpRes = await fetch(lnurlpUrl).then(r => r.json());

  const callback = lnurlpRes.callback;
  const msats = sats * 1000;

  const invoiceRes = await fetch(`${callback}?amount=${msats}`).then(r => r.json());

  return invoiceRes.pr;
}

function showEndScreen() {
  const endScreen = document.getElementById("endScreen");
  const finalStats = document.getElementById("finalStats");

  const accuracy = totalClicks > 0 ? Math.round((score / totalClicks) * 100) : 0;

  finalStats.innerHTML = `
    <strong>Final Score:</strong> ${score}<br>
    <strong>Total Clicks:</strong> ${totalClicks}<br>
    <strong>Accuracy:</strong> ${accuracy}%
  `;

  endScreen.classList.remove("hidden");
  document.getElementById("claimRewardBtn").onclick = () => {
    window.payForScore(score);
  };
}

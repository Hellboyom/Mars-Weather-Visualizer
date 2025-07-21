let chart;
let globalData = {};
let globalSols = [];


// Simulate weather data for 20 sols
function generateFakeWeatherData() {
  const sols = 20;
  for (let i = 1; i <= sols; i++) {
    const sol = `${i}`;
    globalData[sol] = {
      AT: { av: parseFloat((Math.random() * 90 - 80).toFixed(2)) }, // -80 to +10 °C
      PRE: { av: parseFloat((Math.random() * 500 + 600).toFixed(2)) }, // 600-1100 Pa
      HWS: { av: parseFloat((Math.random() * 20 + 5).toFixed(2)) } // 5-25 m/s
    };
  }
  globalSols = Object.keys(globalData);
}

function fetchWeatherData() {
  generateFakeWeatherData();

  const latestSol = globalSols[globalSols.length - 1];
  const latestData = globalData[latestSol];

  document.getElementById('sol').textContent = `Sol: ${latestSol}`;
  document.getElementById('temperature').textContent = `Avg Temp: ${latestData.AT.av} °C`;
  document.getElementById('pressure').textContent = `Pressure: ${latestData.PRE.av} Pa`;
  document.getElementById('wind').textContent = `Wind Speed: ${latestData.HWS.av} m/s`;

  updateStatus(latestData.AT.av);
  renderChart('temp');

  const archiveContainer = document.getElementById('sol-cards');
  archiveContainer.innerHTML = '';

  globalSols.slice().reverse().forEach(sol => {
    const solData = globalData[sol];
    const card = document.createElement('div');
    card.className = 'sol-card';
    card.innerHTML = `
      <p><strong>Sol:</strong> ${sol}</p>
      <p>${solData.AT.av} °C</p>
      <p>${solData.PRE.av} Pa</p>
      <p>${solData.HWS.av} m/s</p>
    `;
    archiveContainer.appendChild(card);
  });
}

function updateStatus(temp) {
  const status = document.getElementById('status');
  const video = document.getElementById('bgVideo');

  if (temp > -20) {
    status.textContent = "🌞 Mars Heatwave";
  } else if (temp > -50) {
    status.textContent = "🌬️ Chilly Mars Afternoon";
  } else {
    status.textContent = "❄️ Extreme Cold Storm";
  }

  video.load();
  video.play();
}

function renderChart(type) {
  const canvas = document.getElementById('dataChart');
  canvas.classList.remove('fade-in');
  canvas.classList.add('fade-out');

  setTimeout(() => {
    const ctx = canvas.getContext('2d');
    if (chart) chart.destroy();

    let label = '', values = [], color = '';
    let localSols = [...globalSols];

    switch (type) {
      case 'temp':
        label = 'Avg Temp (°C)';
        values = localSols.map(sol => globalData[sol].AT.av);
        color = '#66fcf1';
        break;
      case 'pressure':
        label = 'Pressure (Pa)';
        values = localSols.map(sol => globalData[sol].PRE.av);
        color = '#f39c12';
        break;
      case 'wind':
        label = 'Wind Speed (m/s)';
        values = localSols.map(sol => globalData[sol].HWS.av);
        color = '#e74c3c';
        break;
      case 'forecast':
        label = 'Forecasted Avg Temp (°C)';
        let lastValue = globalData[localSols[localSols.length - 1]].AT.av;
        values = localSols.map(sol => globalData[sol].AT.av);
        for (let i = 0; i < 5; i++) {
          lastValue += Math.random() * 1.5 - 0.5;
          values.push(parseFloat(lastValue.toFixed(2)));
        }
        localSols.push(...Array.from({ length: 5 }, (_, i) => `+${i + 1}`));
        color = '#ff4081';
        break;
    }

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: localSols,
        datasets: [{
          label: label,
          data: values,
          borderColor: color,
          backgroundColor: 'rgba(255,255,255,0.06)',
          tension: 0.35,
          pointBackgroundColor: color,
          pointRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'var(--text-color)',
              font: { family: 'Orbitron', size: 14 }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'var(--text-color)',
              font: { family: 'Rajdhani' }
            },
            grid: { color: 'rgba(255,255,255,0.08)' }
          },
          y: {
            ticks: {
              color: 'var(--text-color)',
              font: { family: 'Rajdhani' }
            },
            grid: { color: 'rgba(255,255,255,0.08)' }
          }
        }
      }
    });

    canvas.classList.remove('fade-out');
    canvas.classList.add('fade-in');

  }, 400);
}

function refreshData() {
  fetchWeatherData();
}

function startClocks() {
  setInterval(() => {
    const now = new Date();
    const earthTime = now.toUTCString().slice(17, 25);
    document.getElementById('earthTime').textContent = earthTime;

    const secondsSinceEpoch = now.getTime() / 1000;
    const marsSeconds = secondsSinceEpoch * 1.027491252;
    const marsDate = new Date(marsSeconds * 1000);

    const marsTimeFormatted = `${String(marsDate.getUTCHours()).padStart(2, '0')}:${String(marsDate.getUTCMinutes()).padStart(2, '0')}:${String(marsDate.getUTCSeconds()).padStart(2, '0')}`;

    document.getElementById('marsTime').textContent = marsTimeFormatted;
  }, 1000);
}
// Custom cursor handler
const customCursor = document.getElementById("custom-cursor");
if (customCursor) {
  document.addEventListener("mousemove", (e) => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseenter", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(2)";
      customCursor.style.background = "#ff4081";
      customCursor.style.boxShadow = "0 0 10px #ff4081, 0 0 20px #ff4081";
    });

    button.addEventListener("mouseleave", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(1)";
      customCursor.style.background = "#66fcf1";
      customCursor.style.boxShadow = "0 0 8px #66fcf1, 0 0 20px #66fcf1";
    });

    button.addEventListener("mousedown", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(0.7)";
    });

    button.addEventListener("mouseup", () => {
      customCursor.style.transform = "translate(-50%, -50%) scale(2)";
      setTimeout(() => {
        customCursor.style.transform = "translate(-50%, -50%) scale(1)";
      }, 150);
    });
  });
}


startClocks();
fetchWeatherData();




const newsBtn = document.getElementById('mars-news-btn');
const newsPanel = document.getElementById('mars-news-panel');
const closeBtn = document.getElementById('close-news-panel');
const newsContent = document.getElementById('news-content');

newsBtn.addEventListener('click', async () => {
  newsPanel.classList.toggle('open');
  newsPanel.classList.remove('hidden');

  // Set loading state
  newsContent.textContent = 'Loading latest Mars news…';

  try {
    const response = await fetch(
      `https://api.spaceflightnewsapi.net/v4/articles/?title_contains=mars&limit=5&cacheBust=${Date.now()}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data.results) && data.results.length) {
      newsContent.innerHTML = data.results
        .map(article => `
          <div class="article">
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.summary.slice(0, 120)}…</p>
          </div>
          <hr>`)
        .join('');
    } else {
      newsContent.textContent = 'No new articles found.';
    }
  } catch (err) {
    console.error('Error fetching news:', err);
    newsContent.textContent = '⚠️ Failed to fetch news. Please try again.';
  }
});

closeBtn.addEventListener('click', () => {
  newsPanel.classList.remove('open');
  setTimeout(() => newsPanel.classList.add('hidden'), 400);
});


async function fetchLatestNews() {
  const newsContent = document.querySelector(".news-content");
  newsContent.innerHTML = "Loading latest Mars news...";

  try {
    const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?search=mars&limit=5&timestamp=${Date.now()}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      newsContent.innerHTML = "";
      data.results.forEach(article => {
        const articleEl = document.createElement("div");
        articleEl.className = "news-article";
        articleEl.innerHTML = `
          <h4>${article.title}</h4>
          <p>${article.summary}</p>
          <a href="${article.url}" target="_blank">Read more</a>
          <hr />
        `;
        newsContent.appendChild(articleEl);
      });
    } else {
      newsContent.innerHTML = "No latest news found.";
    }
  } catch (err) {
    console.error("Failed to fetch latest Mars news", err);
    newsContent.innerHTML = "Failed to load news. Please try again.";
  }
}






let viewer;
let cratersLoaded = false;

window.addEventListener('DOMContentLoaded', () => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZjA1MThkYS1mZjNiLTQxMjgtYjE2Yy1lNDI0YTE0MDJmMGEiLCJpZCI6MzIzMjQxLCJpYXQiOjE3NTMwMzUzODd9.zcLNieKuccjalCYc8rP4Rp8UuADnYBz31UqJN5uc5nw'; // Replace with your token

  const marsEllipsoid = new Cesium.Ellipsoid(3396200, 3396200, 3376200);  // Mars radius
  const mapProjection = new Cesium.GeographicProjection(marsEllipsoid);
  const marsGlobe = new Cesium.Globe(marsEllipsoid);

  viewer = new Cesium.Viewer('cesiumContainer', {
    globe: marsGlobe,
    mapProjection: mapProjection,
    terrainProvider: new Cesium.EllipsoidTerrainProvider({ ellipsoid: marsEllipsoid }),
    baseLayerPicker: false,
    timeline: false,
    animation: false,
  });

  viewer.scene.globe.enableLighting = true;
  viewer.scene.moon.destroy(); // remove Earth's moon

  viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
    url: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map&service=WMS',
    layers: 'MOLA_THEMIS_blend',
    parameters: { transparent: false, format: 'image/png' },
    tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: marsEllipsoid }),
    tileWidth: 512,
    tileHeight: 512
  }));
});

// ✅ Function to add crater
function addCrater(name, lat, lon, diameter) {
  console.log("Adding crater:", name);
  if (!viewer) {
    console.error("Viewer not initialized yet.");
    return;
  }

  viewer.entities.add({
    name,
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    point: {
      pixelSize: Math.max(4, Math.min(16, diameter / 50)),
      color: Cesium.Color.RED.withAlpha(0.8),
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 1
    },
    label: {
      text: name,
      font: '12pt sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, -12)
    },
    description: `
      <h2>${name}</h2>
      <p><b>Diameter:</b> ${diameter} km</p>
      <p><b>Coordinates:</b> ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
    `
  });
}

document.getElementById('showCratersBtn').addEventListener('click', () => {
  // ✅ Hide the glass UI
  const glassUI = document.getElementById('glassUI');
  if (glassUI) glassUI.style.display = 'none';

  // ✅ Show the Cesium globe fullscreen
  const cesiumContainer = document.getElementById('cesiumContainer');
  if (cesiumContainer) {
    cesiumContainer.style.display = 'block';
    cesiumContainer.style.position = 'absolute';
    cesiumContainer.style.top = '0';
    cesiumContainer.style.left = '0';
    cesiumContainer.style.width = '100vw';
    cesiumContainer.style.height = '100vh';
    cesiumContainer.style.zIndex = '1000';
  }

  // ✅ Show the "Back to UI" button
  const backBtn = document.getElementById('backToUIBtn');
  if (backBtn) backBtn.style.display = 'block';

  // ✅ Load crater data if not already loaded
  if (window.cratersLoaded) return;

  fetch('craters.json')
    .then(res => res.json())
    .then(craters => {
      craters.forEach(c => addCrater(c.name, c.lat, c.lon, c.diameter));
      window.cratersLoaded = true;
      console.log('Loaded', craters.length, 'craters');
    })
    .catch(err => console.error('Failed to load craters:', err));
});
document.getElementById('backToUIBtn').addEventListener('click', () => {
  // Show UI
  document.getElementById('glassUI').style.display = 'block';
  
  // Hide Cesium
  const cesiumContainer = document.getElementById('cesiumContainer');
  cesiumContainer.style.display = 'none';

  // ✅ Restore body scrolling
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';

  // Hide the back button
  document.getElementById('backToUIBtn').style.display = 'none';
});



























//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZjA1MThkYS1mZjNiLTQxMjgtYjE2Yy1lNDI0YTE0MDJmMGEiLCJpZCI6MzIzMjQxLCJpYXQiOjE3NTMwMzUzODd9.zcLNieKuccjalCYc8rP4Rp8UuADnYBz31UqJN5uc5nw
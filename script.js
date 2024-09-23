let allStations = [];
let recentSearches = [];
const fixedStations = [
    { name: "YouBike2.0_明美公園", available: 0, total: 0 },
    { name: "YouBike2.0_行善社會住宅", available: 0, total: 0 },
    { name: "YouBike2.0_行善行愛路口", available: 0, total: 0 },
];

// Initialize map
const map = L.map('map').setView([25.02605, 121.5436], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch YouBike data
async function fetchYouBikeData() {
    try {
        const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
        const data = await response.json();
        allStations = data;
        populateDistricts();
        updateFixedStations();
        updateStationInfo("YouBike2.0_明美公園"); // 預設顯示明美公園資訊
    } catch (error) {
        console.error("Error fetching YouBike data:", error);
    }
}

// Populate district dropdown
function populateDistricts() {
    const districts = [...new Set(allStations.map(station => station.sarea))];
    const districtsSelect = document.getElementById('districts');
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtsSelect.appendChild(option);
    });
    populateStations();
}

// Populate stations based on selected district
function populateStations() {
    const district = document.getElementById('districts').value;
    const stationsSelect = document.getElementById('stations');
    stationsSelect.innerHTML = '';
    allStations
        .filter(station => station.sarea === district)
        .forEach(station => {
            const option = document.createElement('option');
            option.value = station.sna;
            option.textContent = station.sna;
            stationsSelect.appendChild(option);
        });
    updateStationInfo(stationsSelect.value);
}

// Update station information
function updateStationInfo(stationName) {
    const station = allStations.find(s => s.sna === stationName) || {};
    document.getElementById('station-name').textContent = `站點名稱: ${station.sna || '無數據'}`;
    document.getElementById('station-area').textContent = `行政區: ${station.sarea || '無數據'}`;
    document.getElementById('station-location').textContent = `位置: ${station.ar || '無數據'}`;
    document.getElementById('update-time').textContent = `更新時間: ${station.mday || '無數據'}`;
    document.getElementById('total-bikes').textContent = `總停車格: ${station.total || '無數據'}`;
    document.getElementById('available-bikes').textContent = `可借車輛: ${station.available_rent_bikes || '無數據'}`;
    
    // Update map marker
    map.setView([station.latitude, station.longitude], 13);
    L.marker([station.latitude, station.longitude]).addTo(map).bindPopup(station.sna).openPopup();

    // Add to recent searches
    addToRecentSearches(station.sna);
}

// Add to recent searches
function addToRecentSearches(stationName) {
    if (!recentSearches.includes(stationName)) {
        if (recentSearches.length >= 3) {
            recentSearches.shift(); // Remove the oldest search
        }
        recentSearches.push(stationName);
        updateRecentSearches();
    }
}

// Update recent searches display
function updateRecentSearches() {
    const recentSearchesList = document.getElementById('recent-searches');
    recentSearchesList.innerHTML = '';
    recentSearches.forEach(stationName => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = stationName;
        li.onclick = () => updateStationInfo(stationName);
        recentSearchesList.appendChild(li);
    });
}

// Filter stations based on search input
function filterStations() {
    const query = document.getElementById('station-search').value.toLowerCase();
    const stationsSelect = document.getElementById('stations');
    const options = [...stationsSelect.options];
    stationsSelect.innerHTML = '';
    
    options.filter(option => option.text.toLowerCase().includes(query)).forEach(option => {
        stationsSelect.appendChild(option);
    });
}

// Update fixed stations data
function updateFixedStations() {
    fixedStations.forEach((station, index) => {
        const stationData = allStations.find(s => s.sna === station.name) || {};
        const available = stationData.available_rent_bikes || 0;
        const total = stationData.total || 0;

        document.getElementById(`fixed-station-${index + 1}-available`).textContent = available;
        document.getElementById(`fixed-station-${index + 1}-total`).textContent = total;

        // Initialize fixed station data to ensure display
        if (index === 0) {
            updateStationInfo(station.name); // 顯示明美公園的資訊
        }
    });
}

// Initial fetch
fetchYouBikeData();
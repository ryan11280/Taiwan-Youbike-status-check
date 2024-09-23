let stationData = [];
const districtSelector = document.getElementById('districts');
const stationSelector = document.getElementById('stations');
const recentSearchesList = document.getElementById('recent-searches');
let recentSearches = [];
let map;

async function fetchYouBikeData() {
    const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
    stationData = await response.json();
    populateDistricts();
    displayAllStations(); // 顯示所有站點
    setDefaultStation();  // 設定預設站點
}

function populateDistricts() {
    const districts = [...new Set(stationData.map(station => station.sarea))];
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelector.appendChild(option);
    });
}

function populateStations() {
    const selectedDistrict = districtSelector.value;
    stationSelector.innerHTML = '';

    const filteredStations = stationData.filter(station => station.sarea === selectedDistrict);
    filteredStations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.sno;
        option.textContent = station.sna;
        stationSelector.appendChild(option);
    });
}

function filterStations() {
    const searchTerm = document.getElementById('station-search').value.toLowerCase();
    const filteredStations = stationData.filter(station => station.sna.toLowerCase().includes(searchTerm));
    
    stationSelector.innerHTML = '';
    filteredStations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.sno;
        option.textContent = station.sna;
        stationSelector.appendChild(option);
    });
}

function updateStationInfo() {
    const selectedStation = stationSelector.value;
    const stationInfo = stationData.find(station => station.sno === selectedStation);

    if (stationInfo) {
        document.getElementById('station-name').innerText = `站點名稱: ${stationInfo.sna}`;
        document.getElementById('station-area').innerText = `行政區: ${stationInfo.sarea}`;
        document.getElementById('station-location').innerText = `位置: ${stationInfo.ar}`;
        document.getElementById('update-time').innerText = `更新時間: ${stationInfo.mday}`;
        document.getElementById('total-bikes').innerText = `總停車格: ${stationInfo.total}`;
        document.getElementById('available-bikes').innerText = `可借車輛: ${stationInfo.available_rent_bikes}`;
        
        updateMap(stationInfo.latitude, stationInfo.longitude);
        recordRecentSearch(stationInfo.sna);
    }
}

function displayAllStations() {
    stationData.forEach(station => {
        addMarker(station);
    });
}

function addMarker(station) {
    const { latitude, longitude, sna } = station;
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup(sna);
}

function setDefaultStation() {
    const defaultStation = stationData.find(station => station.sna === "YouBike2.0_明美公園");
    if (defaultStation) {
        stationSelector.value = defaultStation.sno;
        updateStationInfo();
    }
}

function updateMap(latitude, longitude) {
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    } else {
        map.setView([latitude, longitude], 15); // 更新地圖中心
    }
}

function recordRecentSearch(stationName) {
    if (!recentSearches.includes(stationName)) {
        if (recentSearches.length >= 3) {
            recentSearches.shift(); // 移除最舊的查詢
        }
        recentSearches.push(stationName);
        updateRecentSearchesList();
    }
}

function updateRecentSearchesList() {
    recentSearchesList.innerHTML = '';
    recentSearches.forEach(stationName => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = stationName;
        listItem.onclick = () => {
            const selectedStation = stationData.find(station => station.sna === stationName);
            if (selectedStation) {
                stationSelector.value = selectedStation.sno;
                updateStationInfo(); // 顯示選定的站點資訊
            }
        };
        recentSearchesList.appendChild(listItem);
    });
}

fetchYouBikeData();
let stationData = [];
const districtSelector = document.getElementById('districts');
const stationSelector = document.getElementById('stations');

async function fetchYouBikeData() {
    const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
    stationData = await response.json();
    populateDistricts();
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
        // 這裡可以增加獲取歷史數據的邏輯並繪製圖表
    }
}

function updateMap(latitude, longitude) {
    const map = L.map('map').setView([latitude, longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    L.marker([latitude, longitude]).addTo(map).bindPopup('選定的站點').openPopup();
}

fetchYouBikeData();
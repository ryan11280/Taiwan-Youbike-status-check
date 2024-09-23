let stationData = [];

async function fetchYouBikeData() {
    const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
    stationData = await response.json();
    populateStations();
}

function populateStations() {
    const stationSelect = document.getElementById('stations');
    const districts = [...new Set(stationData.map(station => station.sarea))];

    // 清除選項
    stationSelect.innerHTML = '';
    const districtSelect = document.getElementById('districts');
    districtSelect.innerHTML = '';

    // 填充行政區選擇器
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });

    // 填充站點選擇器
    stationData.forEach(station => {
        const option = document.createElement('option');
        option.value = station.sno;
        option.textContent = station.sna;
        stationSelect.appendChild(option);
    });

    // 添加事件監聽器
    districtSelect.addEventListener('change', filterStations);
    stationSelect.addEventListener('change', updateStationInfo);
}

function filterStations() {
    const selectedDistrict = document.getElementById('districts').value;
    const filteredStations = stationData.filter(station => station.sarea === selectedDistrict);
    
    const stationSelect = document.getElementById('stations');
    stationSelect.innerHTML = '';

    filteredStations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.sno;
        option.textContent = station.sna;
        stationSelect.appendChild(option);
    });
}

function updateMap(latitude, longitude) {
    const map = L.map('map').setView([latitude, longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
    L.marker([latitude, longitude]).addTo(map).bindPopup('選定的站點').openPopup();
}

async function updateStationInfo() {
    const selectedStation = document.getElementById('stations').value;
    const stationInfo = stationData.find(station => station.sno === selectedStation);

    if (stationInfo) {
        document.getElementById('total-bikes').innerText = stationInfo.total;
        document.getElementById('available-bikes').innerText = stationInfo.available_rent_bikes;
        document.getElementById('available-return-bikes').innerText = stationInfo.available_return_bikes;
        document.getElementById('station-name').innerText = stationInfo.sna;
        document.getElementById('station-area').innerText = stationInfo.sarea;
        document.getElementById('station-location').innerText = stationInfo.ar;
        document.getElementById('update-time').innerText = stationInfo.mday;

        // 更新地圖位置
        updateMap(stationInfo.latitude, stationInfo.longitude);

        // 獲取並更新使用率趨勢圖表
        const historyData = await getYouBikeHistory(stationInfo.sno);
        updateChart(historyData);
    }
}

async function getYouBikeHistory(sno) {
    const response = await fetch('https://script.google.com/macros/s/AKfycby1qZTbeZoK2T9ZhANYiM9FFYNJ9WZxZn814jF2u8_vZ9OGi473yMmZQj8DiMq4ZwH1/exec'); // 替換為你的 Apps Script URL
    const historyData = await response.json();
    
    return historyData.filter(record => record.sno === sno);
}

async function updateChart(historyData) {
    const labels = historyData.map(row => row.update_time);
    const rentData = historyData.map(row => row.available_rent_bikes);

    const ctx = document.getElementById('usage-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '可借車輛數',
                data: rentData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        }
    });
}

// 初始化
fetchYouBikeData();
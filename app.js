// YouBike 2.0 即時資料 API
const apiUrl = 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json';

// 獲取 YouBike 即時資料
async function getStationData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 更新站點選擇器和站點資訊
async function updateStationInfo() {
    const stationData = await getStationData();
    const stationSelect = document.getElementById('stations');
    const selectedStation = stationSelect.value;
    const stationInfo = stationData.find(station => station.sno === selectedStation);
    
    if (stationInfo) {
        // 更新站點資訊
        document.getElementById('total-bikes').innerText = stationInfo.total;              // 場站總停車格
        document.getElementById('available-bikes').innerText = stationInfo.available_rent_bikes; // 目前可借車輛數量
        document.getElementById('available-return-bikes').innerText = stationInfo.available_return_bikes; // 目前可還車位數量
        document.getElementById('station-name').innerText = stationInfo.sna;               // 場站名稱
        document.getElementById('station-area').innerText = stationInfo.sarea;             // 場站區域
        document.getElementById('station-location').innerText = stationInfo.ar;            // 地點詳細地址
        document.getElementById('update-time').innerText = stationInfo.mday;               // 資料更新時間
        
        // 更新地圖位置
        updateMap(stationInfo.latitude, stationInfo.longitude);

        // 更新圖表資料
        updateChart(stationInfo);
    }
}

// 初始化地圖
function updateMap(lat, lng) {
    const map = L.map('map').setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([lat, lng]).addTo(map).bindPopup('YouBike Station');
}

// 更新圖表 (假設有趨勢資料)
function updateChart(stationInfo) {
    const ctx = document.getElementById('usage-chart').getContext('2d');
    const usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6天前', '5天前', '4天前', '3天前', '2天前', '昨天', '今天'],
            datasets: [{
                label: '租借率 (%)',
                data: stationInfo.usage_trend || [10, 20, 30, 40, 50, 60, 70], // 模擬趨勢資料
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        }
    });
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化站點選擇器
    getStationData().then(data => {
        const stationSelect = document.getElementById('stations');
        data.forEach(station => {
            const option = document.createElement('option');
            option.value = station.sno;
            option.text = `${station.sna} (${station.sarea})`;
            stationSelect.appendChild(option);
        });
        // 預設選擇第一個站點
        updateStationInfo();
    });
});
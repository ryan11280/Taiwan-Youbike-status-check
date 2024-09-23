// 獲取YouBike即時資料
const apiUrl = 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json';

async function getStationData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

// 更新站點選擇器和資訊
async function updateStationInfo() {
    const stationData = await getStationData();
    const stationSelect = document.getElementById('stations');
    const selectedStation = stationSelect.value;
    const stationInfo = stationData.find(station => station.sno === selectedStation);
    
    if (stationInfo) {
        document.getElementById('total-bikes').innerText = stationInfo.tot;
        document.getElementById('available-bikes').innerText = stationInfo.sbi;
        
        // 更新地圖位置
        updateMap(stationInfo.lat, stationInfo.lng);
        
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

// 更新圖表
function updateChart(stationInfo) {
    const ctx = document.getElementById('usage-chart').getContext('2d');
    const usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6天前', '5天前', '4天前', '3天前', '2天前', '昨天', '今天'],
            datasets: [{
                label: '租借率 (%)',
                data: stationInfo.usage_trend, // 假設這裡有租借趨勢資料
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        }
    });
}

document.addEventListener('DOMContentLoaded', updateStationInfo);
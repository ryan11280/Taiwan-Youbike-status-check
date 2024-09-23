# Ryan's YouBike Check

https://ryan11280.github.io/Taiwan-Youbike-status-check/

## 介紹

**Ryan's YouBike Check** 是一個方便的網頁應用程式，旨在提供即時的台北 YouBike 資訊。使用者可以透過簡單的介面查看各站點的可借車輛數、總車輛數及地圖位置，並能夠追蹤站點的租借使用率趨勢。應用程式使用了 Leaflet 和 Chart.js 進行地圖和圖表的呈現，並具備友好的使用者體驗。

## 功能

- **即時資訊查詢**：提供 YouBike 各站點的即時數據，包括可借車輛數、總車輛數和更新時間。
- **地圖顯示**：選擇站點後自動更新地圖位置，幫助用戶了解站點的實際位置。
- **使用趨勢圖表**：展示選定站點的歷史使用率趨勢。
- **行政區分類**：根據行政區進行站點篩選，提升查詢效率。
- **搜尋功能**：用戶可以通過輸入站名進行快速搜尋。

## 教學

### 環境設置

1. **下載專案**：將專案從 GitHub 上克隆或下載到本地。
   
   ```bash
   git clone [你的 GitHub 專案網址]
   ```

2. **安裝依賴**：如果需要，可以安裝任何必要的依賴（此專案不需要額外的依賴）。

3. **修改 Google Apps Script URL**：在 `script.js` 中將 `{YOUR_WEB_APP_URL}` 替換為你的 Google Apps Script 網址。

### 執行應用程式

1. 打開 `index.html` 檔案，使用瀏覽器打開即可開始使用。
2. 選擇行政區和站點，或直接搜尋站名。
3. 查看即時的 YouBike 資訊及地圖位置。

## 程式碼簡單解釋

### `index.html`

包含應用程式的基本結構和元素，如選擇器、顯示區域及地圖。以下是主要部分：

```html
<div>
    <label for="districts">選擇行政區：</label>
    <select id="districts"></select>
</div>
```

這段程式碼用於創建行政區選擇器。

### `styles.css`

用於美化應用程式的外觀，包括顏色、字型和佈局。這裡的 CSS 提供了友好的使用介面，使內容清晰可讀。

### `script.js`

這是應用程式的核心，負責數據的獲取和處理。以下是一些主要功能的解釋：

- **數據獲取**：
  ```javascript
  async function fetchYouBikeData() {
      const response = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json');
      stationData = await response.json();
      populateStations();
  }
  ```
  這段程式碼從 YouBike API 獲取即時數據並填充站點選擇器。

- **更新地圖**：
  ```javascript
  function updateMap(latitude, longitude) {
      const map = L.map('map').setView([latitude, longitude], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
      }).addTo(map);
      L.marker([latitude, longitude]).addTo(map).bindPopup('選定的站點').openPopup();
  }
  ```
  當用戶選擇站點時，這段程式碼將更新地圖，顯示該站點的位置。

- **顯示使用趨勢圖表**：
  ```javascript
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
  ```
  這段程式碼使用 Chart.js 生成圖表，顯示選定站點的使用趨勢。

## 成果展示

### 界面預覽

![界面預覽](https://via.placeholder.com/800x400?text=YouBike+Check+Interface)

### 使用範例

1. 用戶選擇「大安區」後，站點下拉選單自動更新。
2. 點選某個站點後，地圖會顯示該站點的位置，同時顯示相關的即時資訊。
3. 下方圖表會顯示該站點的使用趨勢，幫助用戶做出更好的租借決策。

## 貢獻

歡迎任何形式的貢獻！如果你有改進的建議或發現了錯誤，請提出 Issues 或發送 Pull Requests。

## 聯繫

如有任何問題或建議，請隨時聯繫 Ryan [你的聯絡方式]。

---

Made by Ryan. 
2024.09.23
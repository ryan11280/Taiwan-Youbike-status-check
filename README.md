以下是一份適合你的 YouBike 即時資訊網站應用程式的 README 文件範本，包含完整介紹與使用教學：

---

# YouBike 即時資訊網站

## 介紹

這個應用程式提供台北 YouBike 站點的即時資訊，包括可借車輛數、總車輛數及地理位置。用戶可以透過搜尋欄位和行政區選擇器輕鬆查找特定站點，並查看該站點的使用率趨勢圖表。所有的歷史資料會被儲存到 Google Sheets 中，以便未來的分析和參考。

## 功能

- **即時資訊顯示**：顯示所選站點的可借車輛數、總車輛數、更新時間等資訊。
- **使用率趨勢圖表**：展示過去的可借車輛數趨勢，幫助用戶了解站點使用情況。
- **站點搜尋功能**：用戶可以透過搜尋欄位快速找到特定的 YouBike 站點。
- **行政區篩選**：根據行政區域過濾站點列表，提升搜尋效率。
- **歷史紀錄儲存**：所有的即時數據會儲存到 Google Sheets，便於後續分析。

## 環境需求

- 瀏覽器（Chrome、Firefox、Safari 等）
- Google 帳號（用於 Google Sheets API）

## 安裝與設定

### 1. 創建 Google Sheets 文件

1. 在 Google Drive 中創建一個新的 Google Sheets 文件，並命名為 `YouBike History`。
2. 在第一行設置以下標題：
   - `sno`
   - `sna`
   - `sarea`
   - `total`
   - `available_rent_bikes`
   - `available_return_bikes`
   - `update_time`
   - `info_time`

### 2. 設定 Google Sheets API

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)。
2. 創建一個新專案。
3. 啟用 Google Sheets API。
4. 創建 API 金鑰並記下來。

### 3. 編輯 Apps Script

1. 在 Google Sheets 中點擊“擴充功能” -> “Apps Script”。
2. 複製並粘貼以下代碼：

```javascript
function doPost(e) {
    const sheet = SpreadsheetApp.openById('{SPREADSHEET_ID}').getSheetByName('YouBike History');
    const data = JSON.parse(e.postData.contents);
    const newRow = [];
    
    newRow.push(data.sno, data.sna, data.sarea, data.total, data.available_rent_bikes, data.available_return_bikes, data.update_time, data.info_time);
    sheet.appendRow(newRow);
    return ContentService.createTextOutput(JSON.stringify({result: 'success'}));
}

function doGet() {
    const sheet = SpreadsheetApp.openById('{SPREADSHEET_ID}').getSheetByName('YouBike History');
    const data = sheet.getDataRange().getValues();
    
    const jsonData = [];
    for (let i = 1; i < data.length; i++) {
        jsonData.push({
            sno: data[i][0],
            sna: data[i][1],
            sarea: data[i][2],
            total: data[i][3],
            available_rent_bikes: data[i][4],
            available_return_bikes: data[i][5],
            update_time: data[i][6],
            info_time: data[i][7]
        });
    }
    return ContentService.createTextOutput(JSON.stringify(jsonData)).setMimeType(ContentService.MimeType.JSON);
}
```

3. 將 `{SPREADSHEET_ID}` 替換為你的 Google Sheets ID。
4. 點擊“發布” -> “部署為 Web 應用程式”，並記下 URL。

### 4. 網頁程式碼

將以下 HTML 和 JavaScript 代碼儲存為 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YouBike 即時資訊</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>YouBike 即時資訊</h1>
    <div>
        <label for="districts">選擇行政區：</label>
        <select id="districts"></select>
        
        <label for="stations">搜尋站名：</label>
        <input type="text" id="search" placeholder="輸入站名...">
    </div>
    
    <div>
        <label for="stations">選擇站點：</label>
        <select id="stations"></select>
    </div>
    
    <div id="station-info">
        <p>站名：<span id="station-name"></span></p>
        <p>區域：<span id="station-area"></span></p>
        <p>可借車輛數：<span id="available-bikes"></span></p>
        <p>總車輛數：<span id="total-bikes"></span></p>
        <p>更新時間：<span id="update-time"></span></p>
        <p>位置：<span id="station-location"></span></p>
    </div>
    
    <canvas id="usage-chart"></canvas>
    
    <script>
        // 加載資料並初始化圖表和事件
        // ...（完整的 JavaScript 代碼，詳見之前的步驟）
    </script>
</body>
</html>
```

### 5. CSS 樣式

將以下 CSS 代碼儲存為 `styles.css`：

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f4f8;
    color: #333;
}

h1 {
    color: #2c3e50;
}

label {
    margin-right: 10px;
}

#station-info {
    margin-top: 20px;
}

canvas {
    margin-top: 20px;
}
```

### 使用教學

1. **打開網頁應用程式**：在瀏覽器中打開 `index.html`。
2. **選擇行政區**：從下拉選單中選擇要查詢的行政區。
3. **搜尋站名**：在搜尋欄中輸入站名以快速找到特定站點。
4. **選擇站點**：從下拉選單中選擇一個站點，查看即時資訊和使用率趨勢圖表。

## 注意事項

- 確保你的 Google Sheets 文件對應的 Apps Script 能夠正確執行，且 API 金鑰設置正確。
- 在使用過程中如遇到任何問題，請檢查控制台是否有錯誤訊息並進行排除。

---

Made by Ryan. 2024.09.23

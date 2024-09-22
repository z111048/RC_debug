# 鋼筋混凝土設計參考書校對結果查看器

這個項目是一個用於查看鋼筋混凝土設計參考書校對結果的網頁應用。它提供了一個安全的界面，允許用戶通過解密查看和搜索校對結果。

## 功能特點

- 安全的數據存儲：所有數據都經過加密存儲
- 密鑰解鎖：需要正確的密鑰才能訪問內容
- 摘要顯示：顯示總文件數和總問題數
- 文件搜索：可以搜索特定的文件或內容
- 分頁顯示：結果以分頁方式呈現，便於瀏覽
- 問題與原文切換：可以在問題列表和原文之間切換查看

## 安裝說明

1. 克隆此存儲庫到您的本地機器：

   ```
   git clone https://github.com/your-username/concrete-design-proofreading-viewer.git
   ```

2. 進入項目目錄：

   ```
   cd concrete-design-proofreading-viewer
   ```

3. 使用現代瀏覽器（如 Chrome、Firefox、Safari 或 Edge）打開 `index.html` 文件。

## 使用方法

1. 在瀏覽器中打開應用後，您會看到一個要求輸入密鑰的界面。
2. 輸入正確的解密密鑰並點擊"設置金鑰"按鈕。
3. 如果密鑰正確，您將看到校對結果的摘要信息和文件列表。
4. 使用搜索欄可以搜索特定的文件或內容。
5. 點擊"顯示問題"或"顯示原文"按鈕可以查看每個文件的詳細信息。
6. 使用底部的分頁按鈕在不同頁面之間切換。

## 注意事項

- 請確保將 `web_ready_proofreading_results.json` 文件放在與 `index.html` 相同的目錄中。
- 出於安全考慮，請不要在公共場合或不安全的環境中輸入或分享解密密鑰。
- 此應用程序需要在支持 JavaScript 的現代瀏覽器中運行。

## 技術細節

- 前端使用純 HTML、CSS 和 JavaScript 實現。
- 使用 CryptoJS 庫進行數據解密。
- 響應式設計，適配不同尺寸的屏幕。
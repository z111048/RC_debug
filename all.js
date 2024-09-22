let allFiles = [];
const filesPerPage = 10;
let currentPage = 1;
let filteredFiles = [];
let SECRET_KEY = '';

function setKey() {
  const keyInput = document.getElementById('keyInput');
  SECRET_KEY = keyInput.value;
  loadData();
}

function decryptData(encryptedData) {
  try {
    // 將 Base64 字符串轉換為 WordArray
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);

    // 從 ciphertext 中提取 IV（前 16 個字節）
    const iv = CryptoJS.lib.WordArray.create(ciphertext.words.slice(0, 4));

    // 剩餘部分為實際的加密數據
    const encryptedContent = CryptoJS.lib.WordArray.create(ciphertext.words.slice(4));

    const key = CryptoJS.enc.Base64.parse(SECRET_KEY);

    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedContent }, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('解密錯誤:', error);
    alert('解密失敗，請檢查金鑰是否正確');
    throw error;
  }
}

async function loadData() {
  try {
    if (!SECRET_KEY) {
      alert('請先設置金鑰');
      return;
    }
    const response = await fetch('web_ready_proofreading_results.json');
    const encryptedData = await response.text();
    const decryptedData = decryptData(encryptedData);
    allFiles = decryptedData.files;
    filteredFiles = allFiles;

    // 解密成功後，顯示內容並隱藏金鑰輸入部分
    document.getElementById('keyInputSection').classList.add('hidden');
    document.getElementById('contentSection').classList.remove('hidden');

    displaySummary(decryptedData);
    displayPagination();
    displayFiles();
  } catch (error) {
    console.error('Error loading data:', error);
    document.body.innerHTML += '<p>加載數據時發生錯誤。請確保 JSON 文件存在且格式正確,並檢查金鑰是否正確。</p>';
  }
}

function displaySummary(data) {
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = `
    <div class="summary-item">
      <div class="summary-number">${data.total_files}</div>
      <div>總文件數</div>
    </div>
    <div class="summary-item">
      <div class="summary-number">${data.total_issues}</div>
      <div>總問題數</div>
    </div>
  `;
}

function displayFiles() {
  const fileListDiv = document.getElementById('fileList');
  fileListDiv.innerHTML = '';
  const startIndex = (currentPage - 1) * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const filesToDisplay = filteredFiles.slice(startIndex, endIndex);

  filesToDisplay.forEach((file) => {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-item';
    fileDiv.innerHTML = `
      <h3>${file.filename}</h3>
      <p>問題數量：${file.issues_count}</p>
      <button class="toggle-btn" onclick="toggleIssues(this)">顯示問題</button>
      <button class="toggle-btn" onclick="toggleOriginalText(this)">顯示原文</button>
      <div class="issue-list" style="display:none;">
        <h4>可讀性問題：</h4>
        ${displayIssues(file.readability_issues, 'readability')}
        <h4>令人疑惑的陳述：</h4>
        ${displayIssues(file.confusing_statements, 'confusing')}
      </div>
      <div class="original-text" style="display:none;">${file.original_text}</div>
    `;
    fileListDiv.appendChild(fileDiv);
  });
}

function displayIssues(issues, type) {
  return issues
    .map(
      (issue) => `
        <div class="issue-item">
          <span class="issue-type">${type === 'readability' ? '問題' : '陳述'}：</span> ${
        issue.issue || issue.statement
      }<br>
          <span class="issue-type">${type === 'readability' ? '建議' : '解釋'}：</span> ${
        issue.suggestion || issue.explanation
      }
        </div>
      `,
    )
    .join('');
}

function toggleIssues(btn) {
  const issueList = btn.nextElementSibling.nextElementSibling;
  if (issueList.style.display === 'none') {
    issueList.style.display = 'block';
    btn.textContent = '隱藏問題';
  } else {
    issueList.style.display = 'none';
    btn.textContent = '顯示問題';
  }
}

function toggleOriginalText(btn) {
  const originalText = btn.nextElementSibling.nextElementSibling;
  if (originalText.style.display === 'none') {
    originalText.style.display = 'block';
    btn.textContent = '隱藏原文';
  } else {
    originalText.style.display = 'none';
    btn.textContent = '顯示原文';
  }
}

function displayPagination() {
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = () => changePage(i);
    if (i === currentPage) {
      button.disabled = true;
    }
    paginationDiv.appendChild(button);
  }
}

function changePage(page) {
  currentPage = page;
  displayFiles();
  displayPagination();
  window.scrollTo(0, 0);
}

function searchFiles() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  filteredFiles = allFiles.filter(
    (file) =>
      file.filename.toLowerCase().includes(searchTerm) ||
      file.original_text.toLowerCase().includes(searchTerm) ||
      file.readability_issues.some((issue) => issue.issue.toLowerCase().includes(searchTerm)) ||
      file.confusing_statements.some((statement) => statement.statement.toLowerCase().includes(searchTerm)),
  );
  currentPage = 1;
  displayPagination();
  displayFiles();
}

// 頁面加載完成後,等待用戶輸入金鑰
window.onload = () => {
  document.getElementById('keyInput').focus();
};

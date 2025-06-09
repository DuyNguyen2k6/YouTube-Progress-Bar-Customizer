const fileInput = document.getElementById('fileInput');
const chooseFileButton = document.getElementById('chooseFileButton');
const fileNameSpan = document.getElementById('fileName');

// Khi bấm nút tùy chỉnh mở hộp chọn file
chooseFileButton.addEventListener('click', () => {
  fileInput.click();
});

// Khi chọn file, hiện tên file và đọc base64
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileNameSpan.textContent = file.name;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('base64Input').value = reader.result;
        setStatus('', '');
      };
      reader.readAsDataURL(file);
    }
  } else {
    fileNameSpan.textContent = 'No file chosen';
  }
});

// Nút Lưu
document.getElementById('saveButton').addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  const progressColor = document.getElementById('progressColor').value;

  if (base64) {
    chrome.storage.local.set({
      scrubberBase64: base64,
      progressColor: progressColor,
    }, () => {
      setStatus('✅ Image and color saved!', 'success');
    });
  } else {
    setStatus('⚠️ Please enter base64 string or select a file.', 'error');
  }
});

// Load dữ liệu đã lưu khi mở popup
chrome.storage.local.get(['progressColor', 'scrubberBase64'], (data) => {
  if (data.progressColor) {
    document.getElementById('progressColor').value = data.progressColor;
  }
  if (data.scrubberBase64) {
    document.getElementById('base64Input').value = data.scrubberBase64;
  }
});

// Hàm hiển thị trạng thái
function setStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status';
  if (type === 'success') statusEl.classList.add('success');
  else if (type === 'error') statusEl.classList.add('error');
}

// Nút tải lại trang YouTube
document.getElementById('reloadButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
      setStatus('🌐 Page reloaded!', 'success');
    }
  });
});

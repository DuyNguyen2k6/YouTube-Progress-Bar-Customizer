const heightSlider = document.getElementById('heightSlider');
const heightValue = document.getElementById('heightValue');

// Cập nhật giá trị hiển thị chiều cao khi kéo slider
heightSlider.addEventListener('input', () => {
  heightValue.textContent = heightSlider.value;
});

// Sự kiện nút Lưu
document.getElementById('saveButton').addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  const progressColor = document.getElementById('progressColor').value;
  const height = parseInt(heightSlider.value);

  if (base64) {
    chrome.storage.local.set({
      scrubberBase64: base64,
      progressColor: progressColor,
      scrubberHeight: height
    }, () => {
      setStatus('✅ Đã lưu ảnh, màu và chiều cao!', 'success');
    });
  } else {
    setStatus('⚠️ Vui lòng nhập chuỗi base64 hoặc chọn file.', 'error');
  }
});

// Sự kiện chọn file ảnh
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('base64Input').value = reader.result;
      setStatus('', '');
    };
    reader.readAsDataURL(file);
  }
});

// Load dữ liệu đã lưu khi mở popup
chrome.storage.local.get(['progressColor', 'scrubberHeight', 'scrubberBase64'], (data) => {
  if (data.progressColor) {
    document.getElementById('progressColor').value = data.progressColor;
  }
  if (data.scrubberHeight) {
    heightSlider.value = data.scrubberHeight;
    heightValue.textContent = data.scrubberHeight;
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

// Sự kiện nút Tải lại trang YouTube
document.getElementById('reloadButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
      setStatus('🌐 Đã tải lại trang!', 'success');
    }
  });
});

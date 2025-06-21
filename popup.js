const fileInput = document.getElementById('fileInput');
const chooseFileButton = document.getElementById('chooseFileButton');
const fileNameSpan = document.getElementById('fileName');
const previewImage = document.getElementById('previewImage');
const previewButton = document.getElementById('previewButton');
const noGifCheckbox = document.getElementById('noGifCheckbox');

chooseFileButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileNameSpan.textContent = file.name;
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('base64Input').value = reader.result;
        setStatus('', '');
        // updatePreview(reader.result); // Nếu muốn tự động preview khi chọn file
      };
      reader.readAsDataURL(file);
    }
  } else {
    fileNameSpan.textContent = 'No file chosen';
    updatePreview('');
  }
});

function updatePreview(base64) {
  if (base64 && base64.startsWith('data:image')) {
    previewImage.src = base64;
    previewImage.style.display = 'block';
  } else {
    previewImage.src = '';
    previewImage.style.display = 'none';
  }
}

// Load dữ liệu đã lưu khi mở popup
chrome.storage.local.get(['scrubberBase64', 'progressColor1', 'progressColor2', 'noGif'], (data) => {
  if (data.scrubberBase64) {
    document.getElementById('base64Input').value = data.scrubberBase64;
  }
  if (data.progressColor1) {
    document.getElementById('progressColor1').value = data.progressColor1;
  }
  if (data.progressColor2) {
    document.getElementById('progressColor2').value = data.progressColor2;
  }
  noGifCheckbox.checked = !!data.noGif;
});

previewButton.addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  if (noGifCheckbox.checked) {
    updatePreview(''); // Ẩn preview khi No GIF được chọn
    setStatus('Preview disabled because No GIF is selected.', 'error');
  } else {
    console.log('Preview base64:', base64.substring(0, 30));
    updatePreview(base64);
  }
});

document.getElementById('saveButton').addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  const color1 = document.getElementById('progressColor1').value;
  const color2 = document.getElementById('progressColor2').value;
  const noGif = noGifCheckbox.checked;

  if (!noGif && !base64) {
    setStatus('⚠️ Please enter base64 string or select a file, or check No GIF.', 'error');
    return;
  }

  chrome.storage.local.set({
    scrubberBase64: noGif ? '' : base64,
    progressColor1: color1,
    progressColor2: color2,
    noGif: noGif,
  }, () => {
    setStatus('✅ Settings saved!', 'success');
  });
});

document.getElementById('reloadButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
      setStatus('🌐 Page reloaded!', 'success');
    }
  });
});

function setStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status';
  if (type === 'success') statusEl.classList.add('success');
  else if (type === 'error') statusEl.classList.add('error');
}

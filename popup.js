const fileInput = document.getElementById('fileInput');
const chooseFileButton = document.getElementById('chooseFileButton');
const fileNameSpan = document.getElementById('fileName');
const previewImage = document.getElementById('previewImage');
const previewButton = document.getElementById('previewButton');

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
        // updatePreview(reader.result); // tự preview nếu muốn
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

previewButton.addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  console.log('Preview base64:', base64.substring(0, 30));
  updatePreview(base64);
});

document.getElementById('saveButton').addEventListener('click', () => {
  const base64 = document.getElementById('base64Input').value.trim();
  const color1 = document.getElementById('progressColor1').value;
  const color2 = document.getElementById('progressColor2').value;

  if (base64) {
    chrome.storage.local.set({
      scrubberBase64: base64,
      progressColor1: color1,
      progressColor2: color2,
    }, () => {
      setStatus('✅ Image and gradient colors saved!', 'success');
    });
  } else {
    setStatus('⚠️ Please enter base64 string or select a file.', 'error');
  }
});

chrome.storage.local.get(['scrubberBase64', 'progressColor1', 'progressColor2'], (data) => {
  if (data.scrubberBase64) {
    document.getElementById('base64Input').value = data.scrubberBase64;
  }
  if (data.progressColor1) {
    document.getElementById('progressColor1').value = data.progressColor1;
  }
  if (data.progressColor2) {
    document.getElementById('progressColor2').value = data.progressColor2;
  }
});

function setStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status';
  if (type === 'success') statusEl.classList.add('success');
  else if (type === 'error') statusEl.classList.add('error');
}

document.getElementById('reloadButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
      setStatus('🌐 Page reloaded!', 'success');
    }
  });
});

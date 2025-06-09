function applyScrubberImage(scrubber) {
  if (scrubber && !scrubber.classList.contains('custom-pepe')) {
    chrome.storage.local.get(['scrubberBase64'], (data) => {
      if (data.scrubberBase64) {
        scrubber.classList.add('custom-pepe');
        scrubber.style.backgroundImage = `url("${data.scrubberBase64}")`;
        // Đặt chiều cao cố định 80px, không lấy từ storage nữa
        scrubber.style.height = '80px';
      }
    });
  }
}

function observeScrubber() {
  const observer = new MutationObserver(() => {
    const scrubber = document.querySelector('.ytp-scrubber-button');
    applyScrubberImage(scrubber);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

const scrubberInit = document.querySelector('.ytp-scrubber-button');
applyScrubberImage(scrubberInit);
observeScrubber();

// Thêm màu thanh tiến trình và hiệu ứng blur nhẹ glow
chrome.storage.local.get('progressColor', (data) => {
  const color = data.progressColor;
  if (color) {
    const style = document.createElement('style');
    style.textContent = `
      .html5-play-progress,
      .ytp-play-progress,
      .ytp-clip-start-exclude {
        background-color: ${color} !important;
        background-image: none !important;
        box-shadow: 0 0 8px 3px ${color}66 !important; /* 66 = alpha ~40% */
      }
    `;
    document.head.appendChild(style);
  }
});

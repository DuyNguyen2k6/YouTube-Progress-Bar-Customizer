function applyScrubberImage(scrubber) {
  if (scrubber && !scrubber.classList.contains('custom-pepe')) {
    chrome.storage.local.get(['scrubberBase64'], (data) => {
      if (data.scrubberBase64) {
        scrubber.classList.add('custom-pepe');
        scrubber.style.backgroundImage = `url("${data.scrubberBase64}")`;
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

chrome.storage.local.get(['progressColor1', 'progressColor2'], (data) => {
  const color1 = data.progressColor1 || '#FF0000';
  const color2 = data.progressColor2 || '#00FF00';

  const style = document.createElement('style');
  style.textContent = `
    .html5-play-progress,
    .ytp-play-progress,
    .ytp-clip-start-exclude {
      background-image: linear-gradient(90deg, ${color1}, ${color2}) !important;
      background-color: transparent !important;
      background-repeat: no-repeat !important;
      box-shadow: 0 0 8px 3px ${color2}66 !important;
    }
  `;
  document.head.appendChild(style);
});

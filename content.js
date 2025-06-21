function safeChromeStorageGet(keys, callback) {
  try {
    chrome.storage.local.get(keys, (data) => {
      if (chrome.runtime.lastError) return;
      callback(data);
    });
  } catch {
    // Bỏ qua lỗi context invalidated
  }
}

function applyScrubberImage(scrubber) {
  if (!scrubber) return;

  safeChromeStorageGet(['scrubberBase64', 'noGif', 'progressColor2'], (data) => {
    const noGif = data.noGif || false;
    const scrubberBase64 = data.scrubberBase64 || '';
    const progressColor2 = data.progressColor2 || '#00FF00';

    try {
      if (noGif) {
        scrubber.style.backgroundImage = '';
        scrubber.style.backgroundColor = progressColor2;
        scrubber.classList.remove('custom-pepe');
        scrubber.style.height = '';
        scrubber.style.borderRadius = '50%';
        scrubber.style.boxShadow = 'none';
        scrubber.style.border = 'none';
      } else if (scrubberBase64.trim() !== '') {
        scrubber.style.backgroundColor = 'transparent';
        scrubber.style.boxShadow = 'none';
        scrubber.style.border = 'none';
        if (!scrubber.classList.contains('custom-pepe')) {
          scrubber.classList.add('custom-pepe');
        }
        scrubber.style.backgroundImage = `url("${scrubberBase64}")`;
        scrubber.style.height = '80px';
        scrubber.style.borderRadius = 'unset';
      } else {
        scrubber.style.backgroundImage = '';
        scrubber.style.backgroundColor = 'transparent';
        scrubber.classList.remove('custom-pepe');
        scrubber.style.height = '';
        scrubber.style.borderRadius = 'unset';
        scrubber.style.boxShadow = 'none';
        scrubber.style.border = 'none';
      }
    } catch {
      // Bỏ qua lỗi nếu DOM thay đổi trong lúc thao tác
    }
  });
}

function observeScrubber() {
  const observer = new MutationObserver(() => {
    try {
      const scrubber = document.querySelector('.ytp-scrubber-button');
      if (scrubber) {
        applyScrubberImage(scrubber);
      }
    } catch {
      // Bỏ qua lỗi context invalidated
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function applyProgressGradient() {
  safeChromeStorageGet(['progressColor1', 'progressColor2'], (data) => {
    const color1 = data.progressColor1 || '#FF0000';
    const color2 = data.progressColor2 || '#00FF00';

    try {
      const progressEls = document.querySelectorAll('.html5-play-progress, .ytp-play-progress, .ytp-clip-start-exclude');
      if (!progressEls || progressEls.length === 0) return;

      progressEls.forEach(el => {
        if (el && el.style) {
          el.style.setProperty('background-image', `linear-gradient(90deg, ${color1}, ${color2})`, 'important');
          el.style.setProperty('background-color', 'transparent', 'important');
          el.style.setProperty('background-repeat', 'no-repeat', 'important');
        }
      });
    } catch {
      // Bỏ qua lỗi DOM không ổn định
    }
  });
}

function observeProgress() {
  const observer = new MutationObserver(() => {
    try {
      if (document.querySelector('.ytp-play-progress')) {
        applyProgressGradient();
      }
    } catch {
      // Bỏ qua lỗi context invalidated
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
}

function onReady() {
  const scrubberInit = document.querySelector('.ytp-scrubber-button');
  if (scrubberInit) {
    applyScrubberImage(scrubberInit);
  }
  observeScrubber();
  applyProgressGradient();
  observeProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}

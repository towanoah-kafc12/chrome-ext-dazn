(() => {
  const ROOT_CLASS = "dazn-wide-player-root";
  const PLAYER_CLASS = "dazn-wide-player";
  const CANDIDATE_CLASS = "dazn-wide-player-candidate";
  const MAX_PARENT_STEPS = 6;
  let scheduled = false;

  function scheduleApply() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      applyWidePlayerLayout();
    });
  }

  function applyWidePlayerLayout() {
    try {
      const videos = Array.from(document.querySelectorAll("video"));

      document.documentElement.classList.toggle(ROOT_CLASS, videos.length > 0);

      for (const video of videos) {
        video.classList.add(PLAYER_CLASS);
        markLikelyPlayerContainers(video);
      }
    } catch {
      // DAZN側のDOM変更で失敗しても、通常の視聴を邪魔しない。
    }
  }

  function markLikelyPlayerContainers(video) {
    let current = video.parentElement;
    let steps = 0;

    while (current && current !== document.body && steps < MAX_PARENT_STEPS) {
      current.classList.add(CANDIDATE_CLASS);

      if (isLikelyMainPlayer(current, video)) {
        current.classList.add(PLAYER_CLASS);
      }

      current = current.parentElement;
      steps += 1;
    }
  }

  function isLikelyMainPlayer(element, video) {
    const elementRect = element.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();

    if (elementRect.width === 0 || elementRect.height === 0) {
      return false;
    }

    const widthRatio = videoRect.width / elementRect.width;
    const heightRatio = videoRect.height / elementRect.height;

    return widthRatio >= 0.5 && heightRatio >= 0.5;
  }

  const observer = new MutationObserver(scheduleApply);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("resize", scheduleApply, { passive: true });
  scheduleApply();
})();

(() => {
  const ROOT_CLASS = "dazn-wide-player-root";
  const PLAYER_CLASS = "dazn-wide-player";
  const CANDIDATE_CLASS = "dazn-wide-player-candidate";
  const MAX_PARENT_STEPS = 6;
  const DEFAULT_ASPECT_RATIO = 16 / 9;
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

      if (videos.length === 0) {
        return;
      }

      updateSizingVariables(videos[0]);

      for (const video of videos) {
        video.classList.add(PLAYER_CLASS);
        markLikelyPlayerContainers(video);
      }
    } catch {
      // DAZN側のDOM変更で失敗しても、通常の視聴を邪魔しない。
    }
  }

  function updateSizingVariables(video) {
    const headerHeight = getHeaderHeight();
    const availableHeight = Math.max(window.innerHeight - headerHeight, 320);
    const aspectRatio = getVideoAspectRatio(video);
    const maxWidthByHeight = Math.floor(availableHeight * aspectRatio);
    const playerWidth = Math.min(window.innerWidth, maxWidthByHeight);

    document.documentElement.style.setProperty("--dazn-wide-player-header-height", `${headerHeight}px`);
    document.documentElement.style.setProperty("--dazn-wide-player-available-height", `${availableHeight}px`);
    document.documentElement.style.setProperty("--dazn-wide-player-width", `${playerWidth}px`);
    document.documentElement.style.setProperty("--dazn-wide-player-half-width", `${playerWidth / 2}px`);
  }

  function getHeaderHeight() {
    const header = document.querySelector('[data-test-id="HEADER"], header');

    if (!header) {
      return 0;
    }

    const rect = header.getBoundingClientRect();
    return Math.max(0, Math.ceil(rect.height));
  }

  function getVideoAspectRatio(video) {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      return video.videoWidth / video.videoHeight;
    }

    const rect = video.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      return rect.width / rect.height;
    }

    return DEFAULT_ASPECT_RATIO;
  }

  function markLikelyPlayerContainers(video) {
    let current = video.parentElement;
    let steps = 0;

    while (current && current !== document.body && steps < MAX_PARENT_STEPS) {
      current.classList.add(CANDIDATE_CLASS);

      if (isLikelyMainPlayer(current, video) || isDaznPlayerContainer(current)) {
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

  function isDaznPlayerContainer(element) {
    return Boolean(
      element.matches('[data-test-id="PLAYER_ROOT"], [data-test-id="VIDEO_CONTENT_CONTAINER"], [data-target="playerContainer"]')
    );
  }

  const observer = new MutationObserver(scheduleApply);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("resize", scheduleApply, { passive: true });
  window.addEventListener("loadedmetadata", scheduleApply, true);
  scheduleApply();
})();

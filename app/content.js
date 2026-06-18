(() => {
  const ROOT_CLASS = "dazn-wide-player-root";
  const HEADER_HOVER_CLASS = "dazn-wide-player-header-hover";
  const PLAYER_CLASS = "dazn-wide-player";
  const CANDIDATE_CLASS = "dazn-wide-player-candidate";
  const MAX_PARENT_STEPS = 6;
  const DEFAULT_ASPECT_RATIO = 16 / 9;
  const MIN_PLAYER_WIDTH = 320;
  const TOP_PLAYER_GAP = 12;
  const PLAYER_LAYOUT_SELECTOR = '[data-target="player-layout"]';
  const SIDE_BAR_SELECTOR = '[data-test-id="SIDE_BAR"]';
  let scheduled = false;
  let lockedSideBarWidth = 0;
  let hideHeaderTimer = 0;

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
      updateSideBarVariables();

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
    const availableHeight = Math.max(window.innerHeight - headerHeight - TOP_PLAYER_GAP, MIN_PLAYER_WIDTH);
    const aspectRatio = getVideoAspectRatio(video);
    const maxWidthByHeight = Math.floor(availableHeight * aspectRatio);
    const usableLayoutWidth = getUsablePlayerLayoutWidth(video);
    const playerWidth = Math.max(MIN_PLAYER_WIDTH, Math.floor(Math.min(usableLayoutWidth, maxWidthByHeight)));

    setRootCssVariable("--dazn-wide-player-header-height", `${headerHeight}px`);
    setRootCssVariable("--dazn-wide-player-available-height", `${availableHeight}px`);
    setRootCssVariable("--dazn-wide-player-width", `${playerWidth}px`);
    setRootCssVariable("--dazn-wide-player-half-width", `${playerWidth / 2}px`);
  }

  function setRootCssVariable(name, value) {
    if (document.documentElement.style.getPropertyValue(name) === value) {
      return;
    }

    document.documentElement.style.setProperty(name, value);
  }

  function updateSideBarVariables() {
    const sideBar = document.querySelector(SIDE_BAR_SELECTOR);

    if (!sideBar) {
      return;
    }

    if (lockedSideBarWidth === 0) {
      lockedSideBarWidth = Math.max(MIN_PLAYER_WIDTH / 8, Math.ceil(getElementWidth(sideBar)));
    }

    setRootCssVariable("--dazn-wide-player-sidebar-width", `${lockedSideBarWidth}px`);
  }

  function getHeaderHeight() {
    return 0;
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

  function getUsablePlayerLayoutWidth(video) {
    const playerLayout = getPlayerLayout(video);
    const baseWidth = getAvailableLayoutWidth(playerLayout);

    return Math.max(MIN_PLAYER_WIDTH, baseWidth);
  }

  function getPlayerLayout(video) {
    return video.closest(PLAYER_LAYOUT_SELECTOR) || document.querySelector(PLAYER_LAYOUT_SELECTOR);
  }

  function getAvailableLayoutWidth(playerLayout) {
    if (!playerLayout) {
      return window.innerWidth;
    }

    const parent = playerLayout.parentElement;

    if (!parent) {
      return getElementWidth(playerLayout) || window.innerWidth;
    }

    const parentWidth = getContentBoxWidth(parent);

    if (parentWidth <= 0) {
      return getElementWidth(playerLayout) || window.innerWidth;
    }

    const visibleSiblings = Array.from(parent.children).filter((element) => {
      return element !== playerLayout && isLayoutBlockingSibling(element);
    });

    if (visibleSiblings.length === 0) {
      return parentWidth;
    }

    const siblingWidth = visibleSiblings.reduce((total, element) => total + getElementWidth(element), 0);
    const parentStyle = window.getComputedStyle(parent);
    const gap = getFlexGap(parentStyle);
    const totalGap = gap * visibleSiblings.length;

    return Math.max(MIN_PLAYER_WIDTH, parentWidth - siblingWidth - totalGap);
  }

  function isLayoutBlockingSibling(element) {
    if (!isVisibleElement(element)) {
      return false;
    }

    const style = window.getComputedStyle(element);

    if (style.position === "fixed" || style.position === "absolute") {
      return false;
    }

    return !element.matches(SIDE_BAR_SELECTOR);
  }

  function getContentBoxWidth(element) {
    const rect = element.getBoundingClientRect();

    if (rect.width <= 0) {
      return 0;
    }

    const style = window.getComputedStyle(element);
    const paddingLeft = parsePixelValue(style.paddingLeft);
    const paddingRight = parsePixelValue(style.paddingRight);

    return Math.max(0, rect.width - paddingLeft - paddingRight);
  }

  function getElementWidth(element) {
    return Math.max(0, element.getBoundingClientRect().width);
  }

  function getFlexGap(style) {
    return parsePixelValue(style.columnGap || style.gap);
  }

  function parsePixelValue(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function isVisibleElement(element) {
    const rect = element.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      return false;
    }

    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0";
  }

  function updateHeaderHoverState(event) {
    if (window.innerWidth <= 0) {
      return;
    }

    if (event.clientY <= getHeaderHoverZoneHeight()) {
      showHeaderTemporarily();
    }
  }

  function getHeaderHoverZoneHeight() {
    const header = document.querySelector('[data-test-id="HEADER"], header');

    if (!header) {
      return 48;
    }

    return Math.max(48, Math.min(96, Math.ceil(header.getBoundingClientRect().height)));
  }

  function showHeaderTemporarily() {
    document.documentElement.classList.add(HEADER_HOVER_CLASS);
    window.clearTimeout(hideHeaderTimer);
    hideHeaderTimer = window.setTimeout(() => {
      document.documentElement.classList.remove(HEADER_HOVER_CLASS);
    }, 700);
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
    attributes: true,
    attributeFilter: ["aria-expanded", "aria-hidden", "class", "data-menu-type", "data-sub-menu-type", "style"],
    childList: true,
    subtree: true
  });

  window.addEventListener("resize", scheduleApply, { passive: true });
  window.addEventListener("loadedmetadata", scheduleApply, true);
  window.addEventListener("mousemove", updateHeaderHoverState, { passive: true });
  document.addEventListener("transitionend", scheduleApply, true);
  scheduleApply();
})();

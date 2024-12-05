import {
  MAIN_SIDEBAR_MINIFIED,
  MAIN_SIDEBAR_HIDDEN,
  SIDEBAR_MINIFIED,
  SIDEBAR_OVERLAY_EXPANDED,
} from './variables';
export default function createSidebarToggle() {
  const toggleSidebarButton = document.querySelector('#toggle-sidebar-button');
  const main = document.querySelector('.main');
  const sidebarOverlay = main.querySelector('.sidebar-overlay');
  const sidebar = sidebarOverlay.querySelector('.sidebar');

  function isSidebarOpen() {
    return (
      !main.classList.contains(MAIN_SIDEBAR_MINIFIED) &&
      !sidebar.classList.contains(SIDEBAR_MINIFIED)
    );
  }

  function expandSidebarOverlay() {
    sidebarOverlay.classList.add(SIDEBAR_OVERLAY_EXPANDED);
  }

  function shrinkSidebarOverlay() {
    sidebarOverlay.classList.remove(SIDEBAR_OVERLAY_EXPANDED);
  }

  function removeSidebarFromMainGrid() {
    main.classList.add(MAIN_SIDEBAR_HIDDEN);
  }

  function addSidebarToMainGrid() {
    main.classList.remove(MAIN_SIDEBAR_HIDDEN);
  }

  function openSidebar() {
    main.classList.remove(MAIN_SIDEBAR_MINIFIED);
    sidebar.classList.remove(SIDEBAR_MINIFIED);
  }

  function closeSidebar() {
    main.classList.add(MAIN_SIDEBAR_MINIFIED);
    sidebar.classList.add(SIDEBAR_MINIFIED);
  }

  function toggleSidebarManually() {
    const width = window.innerWidth;

    if (isSidebarOpen()) {
      closeSidebar();

      if (width < 750) {
        shrinkSidebarOverlay();
        addSidebarToMainGrid();
      }
    } else {
      openSidebar();

      if (width < 750) {
        expandSidebarOverlay();
        removeSidebarFromMainGrid();
      } else {
        shrinkSidebarOverlay();
        addSidebarToMainGrid();
      }
    }
  }

  function handleResizeChange() {
    const width = window.innerWidth;

    shrinkSidebarOverlay();
    addSidebarToMainGrid();

    if (width < 750) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  toggleSidebarButton.addEventListener('click', toggleSidebarManually);
  window.addEventListener('resize', handleResizeChange);
}

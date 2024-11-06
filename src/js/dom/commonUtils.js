export const isPopupOpen = (popup, classForVisibleState) =>
  popup.classList.contains(classForVisibleState);

export function openPopup(popup, classForVisibleState) {
  popup.classList.add(classForVisibleState);
}

export function closePopup(popup, classForVisibleState) {
  popup.classList.remove(classForVisibleState);
}

export function togglePopup(popup, classForVisibleState) {
  popup.classList.toggle(classForVisibleState);
}

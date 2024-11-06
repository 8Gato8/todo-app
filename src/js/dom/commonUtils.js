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

export function makeElementChildrenList(elementNode) {
  const listOfChildren = [];

  if (elementNode.children.length === 0) return elementNode;

  for (let child of elementNode.children) {
    listOfChildren.push(child, makeElementChildrenList(child));
  }

  return listOfChildren.flat(Infinity);
}

export function handleClickOutsidePopup(
  e,
  popup,
  popupContainerChildrenList,
  classForVisibleState,
) {
  if (!isPopupOpen(popup, classForVisibleState)) return;

  const target = e.target;

  if (popupContainerChildrenList.some((child) => child === target)) return;

  closePopup(popup, classForVisibleState);
}

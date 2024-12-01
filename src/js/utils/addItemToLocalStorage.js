export default function addItemToLocalStorage(itemName, item) {
  localStorage.setItem(itemName, JSON.stringify(item));
}

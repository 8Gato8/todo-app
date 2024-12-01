export default function getItemFromLocalStorage(itemName) {
  return JSON.parse(localStorage.getItem(itemName));
}

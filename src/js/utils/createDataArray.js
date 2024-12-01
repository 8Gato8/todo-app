import getItemFromLocalStorage from './getItemFromLocalStorage';
import addItemToLocalStorage from './addItemToLocalStorage';
import createDataObject from './createDataObject';

export default function createDataArray(staticData, itemName) {
  let dataArray = null;

  const item = getItemFromLocalStorage(itemName);

  if (item) {
    dataArray = item;
  } else {
    dataArray = staticData.map((data) => createDataObject(data));
    addItemToLocalStorage(itemName, dataArray);
  }

  return dataArray;
}

import generateUniqueId from './generateUniqueId';
export default function createPriorityWithUniqueId(newPriorityData) {
  const id = generateUniqueId();

  return { ...newPriorityData, id };
}

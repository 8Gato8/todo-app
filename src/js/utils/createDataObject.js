import generateUniqueId from './generateUniqueId';
export default function createPriority(data) {
  const id = generateUniqueId();

  return { ...data, id };
}

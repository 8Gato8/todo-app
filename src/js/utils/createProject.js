import generateUniqueId from './generateUniqueId';

export default function createProject(projectData) {
  const id = generateUniqueId();

  let tasks = [];

  return { ...projectData, id, tasks };
}

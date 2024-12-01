import getItemFromLocalStorage from './getItemFromLocalStorage';
import addItemToLocalStorage from './addItemToLocalStorage';
import createProject from './createProject';

export default function createProjectsArray(projectsName, defaultColor) {
  let projects = null;

  const projectsFromLocalStorage = getItemFromLocalStorage(projectsName);

  if (projectsFromLocalStorage) {
    projects = projectsFromLocalStorage;
  } else {
    const inboxProject = createProject({
      title: 'Входящие',
      defaultProject: true,
      color: defaultColor,
    });

    projects = [inboxProject];
    addItemToLocalStorage(projectsName, projects);
  }

  return projects;
}

import './style.css';

import taskEditor from './js/dom/taskEditor';

import createTask from './js/task';
import createProject from './js/project';

import generateUniqueId from './js/utils/generateUniqueId';

export const priorities = [
  { title: 'Приоритет 1', number: 1 },
  { title: 'Приоритет 2', number: 2 },
  { title: 'Приоритет 3', number: 3 },
  { title: 'Приоритет 4', number: 4 },
];
export const projects = [];

function createProjectWithUniqueId(newProjectData) {
  const id = generateUniqueId();

  const newProject = createProject({ ...newProjectData, id });
  return newProject;
}

export function createTaskWithUniqueId(newTaskData) {
  const id = generateUniqueId();

  const newTask = createTask({ ...newTaskData, id });

  return newTask;
}

export function addTaskToProject(newTask) {
  newTask.project.addTask(newTask);
}

export const inboxProject = createProjectWithUniqueId({ title: 'Входящие' });

projects.push(inboxProject);

/* adds all sorts of event listeners related to task editor */
taskEditor();

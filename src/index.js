import './style.css';

import projectNavigation from './js/dom/projectNavigation/projectNavigation';
import taskEditor from './js/dom/taskEditor/taskEditor';

import createTask from './js/task';
import createProject from './js/project';

import generateUniqueId from './js/utils/generateUniqueId';

export const priorities = [
  {
    title: 'Приоритет 1',
    number: 1,
    color: {
      title: 'Ягодно-красный',
      hexCode: '#b8255f',
    },
  },
  {
    title: 'Приоритет 2',
    number: 2,
    color: {
      title: 'Красный',
      hexCode: '#cf473a',
    },
  },
  {
    title: 'Приоритет 3',
    number: 3,
    color: {
      title: 'Оранжевый',
      hexCode: '#c77100',
    },
  },
  {
    title: 'Приоритет 4',
    number: 4,
    color: {
      title: 'Желтый',
      hexCode: '#b29104',
    },
  },
];
export const projects = [];

export const colors = [
  {
    title: 'Ягодно-красный',
    hexCode: '#b8255f',
  },
  {
    title: 'Красный',
    hexCode: '#cf473a',
  },
  {
    title: 'Оранжевый',
    hexCode: '#c77100',
  },
  {
    title: 'Желтый',
    hexCode: '#b29104',
  },
];

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
const homeProject = createProjectWithUniqueId({
  title: 'Дом',
  color: { title: 'Красный', hexCode: '#cf473a' },
});
const jobProject = createProjectWithUniqueId({
  title: 'Работа',
  color: { title: 'Желтый', hexCode: '#b29104' },
});

projects.push(inboxProject, homeProject, jobProject);

/* adds all sorts of event listeners related to task editor */
projectNavigation();
taskEditor();

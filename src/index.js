import './style.css';

import createProjectNavigation from './js/dom/createProjectNavigation/createProjectNavigation';
import createProjectEditor from './js/dom/createProjectEditor/createProjectEditor';
import createTaskEditor from './js/dom/createTaskEditor/createTaskEditor';
import createProjectArea from './js/dom/createProjectArea/createProjectArea';

import createProject from './js/utils/createProject';
import createDataObject from './js/utils/createDataObject';

export function addTask(tasks, newTask) {
  tasks.push(newTask);
}

export function removeTask(tasks, task) {
  const taskIndex = tasks.indexOf(task);
  tasks.splice(taskIndex, 1);
}

/* TODO: Решить, будет ли создаваться и использоваться функционал чекбоксов внутри task */

function addItemsToChecklist(checklist, newItems) {
  checklist.push(newItems);
}

function removeItemFromChecklist(checklist, item) {
  const itemIndex = checklist.indexOf(item);
  checklist.splice(itemIndex, 1);
}

/* TODO: создать универсальную функцию для colors и priorities */

const colorsData = [
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
  {
    title: 'Оливковый',
    hexCode: '#949c31',
  },
  {
    title: 'Лайм',
    hexCode: '#65a331',
  },
  {
    title: 'Зелёный',
    hexCode: '#369307',
  },
  {
    title: 'Мятно-зелёный',
    hexCode: '#42a393',
  },
  {
    title: 'Зеленовато-голубой',
    hexCode: '#148fad',
  },
  {
    title: 'Небесно-голубой',
    hexCode: '#319dc0',
  },
  {
    title: 'Светло-голубой',
    hexCode: '#6988a4',
  },
  {
    title: 'Синий',
    hexCode: '#2a67e2',
  },
  {
    title: 'Виноградный',
    hexCode: '#692ec2',
  },
  {
    title: 'Фиолетовый',
    hexCode: '#ac30cc',
  },
  {
    title: 'Лавандовый',
    hexCode: '#a4698c',
  },
  {
    title: 'Ярко-розовый',
    hexCode: '#e05095',
  },
  {
    title: 'Розовый',
    hexCode: '#b2635c',
  },
  {
    title: 'Аспидно-серый',
    hexCode: '#808080',
  },
  {
    title: 'Серый',
    hexCode: '#999999',
  },
  {
    title: 'Тауп',
    hexCode: '#8f7a69',
  },
];

let colors = null;

if (JSON.parse(localStorage.getItem('colors'))) {
  colors = JSON.parse(localStorage.getItem('colors'));
} else {
  colors = colorsData.map((data) => createDataObject(data));
  localStorage.setItem('colors', JSON.stringify(colors));
}

const prioritiesData = [
  {
    title: 'Приоритет 1',
    number: 1,
    color: {
      title: 'Красный',
      hexCode: '#d1453b',
    },
  },
  {
    title: 'Приоритет 2',
    number: 2,
    color: {
      title: 'Оранжевый',
      hexCode: '#eb8909',
    },
  },
  {
    title: 'Приоритет 3',
    number: 3,
    color: {
      title: 'Синий',
      hexCode: '#246fe0',
    },
  },
  {
    title: 'Приоритет 4',
    number: 4,
    color: {
      title: 'Серый',
      hexCode: '#666',
    },
  },
];

let priorities = null;

if (JSON.parse(localStorage.getItem('priorities'))) {
  priorities = JSON.parse(localStorage.getItem('priorities'));
} else {
  priorities = prioritiesData.map((data) => createDataObject(data));
  localStorage.setItem('priorities', JSON.stringify(priorities));
}

let projects = null;

if (JSON.parse(localStorage.getItem('projects'))) {
  projects = JSON.parse(localStorage.getItem('projects'));
} else {
  const inboxProject = createProject({
    title: 'Входящие',
    defaultProject: true,
    color: { title: 'Аспидно-серый', hexCode: '#808080' },
  });

  projects = [inboxProject];
  localStorage.setItem('projects', JSON.stringify(projects));
}

const inboxProject = projects.find((p) => p.defaultProject);

export let openedProject = inboxProject;
export function setOpenedProject(newProject) {
  openedProject = newProject;
}

export let chosenProject = null;
export function setChosenProject(newValue) {
  chosenProject = newValue;
}

export let chosenTask = null;
export function setChosenTask(newValue) {
  chosenTask = newValue;
}

export function deleteProjectFromProjectsArray(project) {
  const projectIndex = projects.indexOf(project);
  projects.splice(projectIndex, 1);

  localStorage.setItem('projects', JSON.stringify(projects));
}

export function addProjectToProjectsArray(project) {
  projects.push(project);

  localStorage.setItem('projects', JSON.stringify(projects));
}

/* Спорное решение */
export function deleteTaskFromOpenedProject(task) {
  removeTask(openedProject.tasks, task);

  localStorage.setItem('projects', JSON.stringify(projects));
}

export const projectNavigation = createProjectNavigation(projects, priorities, inboxProject);
export const projectEditor = createProjectEditor(projects, priorities, colors);
export const taskEditor = createTaskEditor(projects, priorities, inboxProject);
export const projectArea = createProjectArea(projects, priorities);

projectNavigation.render();
projectEditor.renderListItems();
taskEditor.render(projects, priorities);
projectArea.updateProjectArea();

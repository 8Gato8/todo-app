import './style.css';

import createProjectNavigation from './js/dom/createProjectNavigation/createProjectNavigation';
import createProjectEditor from './js/dom/createProjectEditor/createProjectEditor';
import createTaskEditor from './js/dom/createTaskEditor/createTaskEditor';

import createProjectWithUniqueId from './js/utils/createProjectWithUniqueId';

export const priorities = [
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
export let projects = [];

export let chosenProject = null;
export function setChosenProject(newProject) {
  chosenProject = newProject;
}

export function deleteProjectFromProjectsArray(chosenProject) {
  projects = projects.filter((p) => p !== chosenProject);
}

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

export const inboxProject = createProjectWithUniqueId({
  title: 'Входящие',
  color: { title: 'Аспидно-серый', hexCode: '#808080' },
});

projects.push(inboxProject);

export const projectNavigation = createProjectNavigation();
export const projectEditor = createProjectEditor();
export const taskEditor = createTaskEditor();

projectNavigation.render();
projectEditor.renderListItems();
taskEditor.render();

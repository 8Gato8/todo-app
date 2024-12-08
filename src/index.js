import './style.css';

import createSidebarToggle from './js/dom/createSidebarToggle/createSidebarToggle';
import createProjectNavigation from './js/dom/createProjectNavigation/createProjectNavigation';
import createProjectEditor from './js/dom/createProjectEditor/createProjectEditor';
import createTaskEditor from './js/dom/createTaskEditor/createTaskEditor';
import createProjectArea from './js/dom/createProjectArea/createProjectArea';

import addItemToLocalStorage from './js/utils/addItemToLocalStorage';

import createDataArray from './js/utils/createDataArray';
import createProjectsArray from './js/utils/createProjectsArray';

import { colorsData, prioritiesData } from './js/data';

export function addTask(tasks, newTask) {
  tasks.push(newTask);
}

export function removeTask(tasks, task) {
  const taskIndex = tasks.indexOf(task);
  tasks.splice(taskIndex, 1);
}

const colors = createDataArray(colorsData, 'colors');

const defaultColor = colors.find((color) => color.defaultColor);

const priorities = createDataArray(prioritiesData, 'priorities');

const projects = createProjectsArray('projects', defaultColor);

const inboxProject = projects.find((project) => project.defaultProject);

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

  addItemToLocalStorage('projects', projects);
}

export function addProjectToProjectsArray(project) {
  projects.push(project);

  addItemToLocalStorage('projects', projects);
}

/* Спорное решение */
export function deleteTaskFromOpenedProject(task) {
  removeTask(openedProject.tasks, task);

  addItemToLocalStorage('projects', projects);
}

createSidebarToggle();
export const projectNavigation = createProjectNavigation(
  projects,
  priorities,
  inboxProject
);
export const projectEditor = createProjectEditor(
  projects,
  priorities,
  colors,
  defaultColor
);
export const taskEditor = createTaskEditor(projects, priorities, inboxProject);
export const projectArea = createProjectArea(projects, priorities);

projectNavigation.render();
projectEditor.renderListItems();
taskEditor.render(projects, priorities);
projectArea.updateProjectArea();

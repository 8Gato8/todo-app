import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
  PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN,
  PROJECT_NAVIGATION_LIST_ITEM_HIDDEN,
  SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import { projects, inboxProject, colors } from '../../..';

import { isPopupOpen, openPopup, closePopup } from '../commonUtils';

export default function projectNavigation() {
  /* query selectors */

  const newProjectEditorOverlay = document.querySelector('#new-project-editor-overlay');

  const addNewProjectButton = document.querySelector(
    '.project-navigation__open-new-project-popup-button',
  );
  const projectNavigationChevronButton = document.querySelector(
    '.project-navigation__chevron-button',
  );

  const projectNavigationList = document.querySelector('.project-navigation-list');

  const projectNavigationListItemTemplate = document.querySelector(
    '#project-navigation-list-item-template',
  );

  const newProjectEditorSelectColorButton = document.querySelector(
    '#new-project-editor-select-color-button',
  );
  const selectColorButtonColorCircle = newProjectEditorSelectColorButton.querySelector(
    '.new-project-editor__color-circle',
  );
  const selectColorButtonTitle = newProjectEditorSelectColorButton.querySelector(
    '.new-project-editor-select-button__title',
  );

  const newProjectEditorSelectColorPopup = document.querySelector(
    '#new-project-editor-select-color-popup',
  );

  const newProjectEditorSelectColorList = document.querySelector(
    '#new-project-editor-select-color-list',
  );
  const newProjectEditorSelectListItemTemplate = document.querySelector(
    '#new-project-editor-select-item-template',
  );

  const cancelButton = document.querySelector('#new-project-editor-cancel-button');
  const addTaskButton = document.querySelector('#new-project-editor-add-task-button');

  /* variables */

  let chosenProject = inboxProject;
  let chevronOpen = true;

  /* utils */

  function highlightInitialChosenProjectNavigationButton(projectNavigationButtons) {
    projectNavigationButtons.forEach((projectNavigationButton) => {
      const buttonText =
        projectNavigationButton.querySelector('.button-with-icon__text').textContent;

      if (chosenProject.title === buttonText) {
        projectNavigationButton.classList.add(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        );
      }
    });
  }

  function highlightProjectNavigationButton(projectNavigationButton) {
    projectNavigationButton.classList.add(PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE);
  }

  function renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  ) {
    const projectNavigationButtons = [];

    projects.forEach((project) => {
      const projectNavigationListItemTemplateClone =
        projectNavigationListItemTemplate.content.cloneNode(true);

      const projectNavigationListItem = projectNavigationListItemTemplateClone.querySelector(
        '.project-navigation-list__item',
      );

      if (project === inboxProject) {
        projectNavigationListItem.classList.add('project-navigation-list__item_always_visible');
      }

      const projectNavigationButton = projectNavigationListItem.querySelector(
        '.project-navigation__button',
      );

      projectNavigationButtons.push(projectNavigationButton);

      const buttonWithIconText = projectNavigationListItem.querySelector('.button-with-icon__text');
      buttonWithIconText.textContent = project.title;

      const projectNavigationTaskCount = projectNavigationListItem.querySelector(
        '.project-navigation-button__task-count',
      );
      projectNavigationTaskCount.textContent = project.tasks.length || '';

      projectNavigationListItem.addEventListener('click', () =>
        handleProjectNavigationListItemClick(
          projectNavigationButton,
          projectNavigationButtons,
          project,
        ),
      );

      projectNavigationList.append(projectNavigationListItem);
    });

    highlightInitialChosenProjectNavigationButton(projectNavigationButtons);
  }

  function removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons) {
    projectNavigationButtons.forEach((projectNavigationButton) => {
      if (
        projectNavigationButton.classList.contains(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        )
      ) {
        projectNavigationButton.classList.remove(
          PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
        );
      }
    });
  }

  const switchChevronState = () => (chevronOpen = !chevronOpen);

  function toggleChevronButtonStyles() {
    if (chevronOpen) {
      projectNavigationChevronButton.classList.add(PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN);
    } else {
      projectNavigationChevronButton.classList.remove(PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN);
    }
  }

  function toggleListItemsVisibilityState() {
    const projectNavigationListItems = projectNavigationList.querySelectorAll(
      '.project-navigation-list__item',
    );

    projectNavigationListItems.forEach((projectNavigationListItem) => {
      if (chevronOpen) {
        projectNavigationListItem.classList.remove(PROJECT_NAVIGATION_LIST_ITEM_HIDDEN);
      } else {
        projectNavigationListItem.classList.add(PROJECT_NAVIGATION_LIST_ITEM_HIDDEN);
      }
    });
  }

  function setInitialSelectColorButtonUI(colors) {
    const defaultColor = colors[0];
    selectColorButtonColorCircle.style.backgroundColor = defaultColor.hexCode;
    selectColorButtonTitle.textContent = defaultColor.name;
  }

  function renderSelectListItems(newProjectEditorSelectColorList, colors) {
    colors.forEach((color) => {
      const selectListItemClone = newProjectEditorSelectListItemTemplate.content.cloneNode(true);
      const selectListItem = selectListItemClone.querySelector('.new-project-editor__select-item');

      selectListItem.setAttribute('data-hexCode', color.hexCode);

      const selectListItemColorCircle = selectListItem.querySelector(
        '.new-project-editor__color-circle',
      );
      selectListItemColorCircle.style.backgroundColor = color.hexCode;

      const selectListItemTitle = selectListItem.querySelector(
        '.new-project-editor-select-item__title',
      );

      selectListItemTitle.textContent = color.name;

      newProjectEditorSelectColorList.append(selectListItem);
    });
  }

  /* event's handlers */

  function handleProjectNavigationListItemClick(
    projectNavigationButton,
    projectNavigationButtons,
    project,
  ) {
    chosenProject = project;

    removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons);
    highlightProjectNavigationButton(projectNavigationButton);
  }

  function handleAddNewProjectButtonClick(newProjectEditorOverlay, editorClassForVisibleState) {
    openPopup(newProjectEditorOverlay, editorClassForVisibleState);
  }

  function handleNewProjectEditorOverlayClick(e, editorClassForVisibleState) {
    const { target, currentTarget: popup } = e;

    if (target === popup) {
      closePopup(popup, editorClassForVisibleState);
    }
  }

  function handleCancelButtonClick(newProjectEditorOverlay, editorClassForVisibleState) {
    /* TODO: Дописать логику очистки инпутов */
    closePopup(newProjectEditorOverlay, editorClassForVisibleState);
  }

  function handleProjectNavigationChevronButton() {
    switchChevronState();
    toggleChevronButtonStyles();
    toggleListItemsVisibilityState();
  }

  /* event's listeners */

  addNewProjectButton.addEventListener('click', () =>
    handleAddNewProjectButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  projectNavigationChevronButton.addEventListener('click', () =>
    handleProjectNavigationChevronButton(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  newProjectEditorOverlay.addEventListener('click', (e) =>
    handleNewProjectEditorOverlayClick(e, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  newProjectEditorSelectColorButton.addEventListener('click', () =>
    openPopup(newProjectEditorSelectColorPopup, SELECT_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  );

  setInitialSelectColorButtonUI(colors);
  renderSelectListItems(newProjectEditorSelectColorList, colors);
}

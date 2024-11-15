import { OVERLAY_CLASS_FOR_VISIBLE_STATE } from '../commonVariables';

import {
  PROJECT_NAVIGATION_BUTTON_CLASS_FOR_HIGHLIGHTED_STATE,
  PROJECT_NAVIGATION_CHEVRON_BUTTON_OPEN,
  PROJECT_NAVIGATION_LIST_ITEM_HIDDEN,
  SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
  SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
} from './variables';

import { projects, inboxProject, colors } from '../../..';
import createProjectWithUniqueId from '../../utils/createProjectWithUniqueId';

import {
  openPopup,
  closePopup,
  togglePopup,
  makeElementChildrenList,
  handleClickOutsidePopup,
  showTick,
  handleCancelButtonClick,
  handlePopupItemClick,
  handleEditorOverlayClick,
  isFormValid,
  toggleAddButtonDisabledState,
} from '../commonUtils';

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

  const newProjectTitle = document.querySelector('#new-project-title');

  const newProjectEditorSelectColorButton = document.querySelector(
    '#new-project-editor-select-color-button',
  );

  const selectButtonIcons = document.querySelectorAll('.select-button-circle');
  const selectButtonTitles = document.querySelectorAll('.new-project-editor-select-button__title');

  const newProjectSelectColorContainer = document.querySelector(
    '#new-project-editor-select-color-container',
  );

  const newProjectEditorSelectColorPopup = document.querySelector(
    '#new-project-editor-select-color-popup',
  );

  const newProjectEditorSelectPopupsNodeList = document.querySelectorAll(
    '.new-project-editor__select-popup',
  );

  const newProjectEditorSelectColorList = document.querySelector(
    '#new-project-editor-select-color-list',
  );
  const newProjectEditorSelectListItemTemplate = document.querySelector(
    '#new-project-editor-select-item-template',
  );

  const inputs = document.querySelectorAll('.new-project-editor__input');

  const cancelButton = document.querySelector('#new-project-editor-cancel-button');
  const addTaskButton = document.querySelector('#new-project-editor-add-project-button');

  /* variables */

  const selectColorContainerChildrenList = makeElementChildrenList(newProjectSelectColorContainer);

  let chosenProject = inboxProject;
  let chevronOpen = true;

  const defaultColor = colors[0];

  let newProjectDataValues = {
    title: '',
    color: defaultColor,
  };

  const allTicks = {
    color: [],
  };

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
      const projectIcon = projectNavigationButton.querySelector('.icon');

      projectIcon.style.fill = project.color.hexCode;

      projectNavigationButtons.push(projectNavigationButton);

      const buttonWithIconText = projectNavigationListItem.querySelector('.button-with-icon__text');
      buttonWithIconText.textContent = project.title;

      const projectNavigationTaskCount = projectNavigationListItem.querySelector(
        '.project-navigation-button__task-count',
      );
      projectNavigationTaskCount.textContent = project.tasks.length || '';

      projectNavigationListItem.addEventListener('click', () =>
        handleProjectNavigationListItemClick(projectNavigationButton, projectNavigationButtons),
      );

      projectNavigationList.append(projectNavigationListItem);
    });

    highlightInitialChosenProjectNavigationButton(projectNavigationButtons);
  }

  function clearProjectNavigationList(projectNavigationList) {
    while (projectNavigationList.firstChild) {
      projectNavigationList.removeChild(projectNavigationList.firstChild);
    }
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

  function updateNewDataValues(valueName, dataValue) {
    newProjectDataValues[valueName] = dataValue;
  }

  function renderInitialSelectButtonUI(
    defaultColor,
    selectColorButtonTitle,
    selectColorButtonIcon,
  ) {
    selectColorButtonIcon.style.backgroundColor = defaultColor.hexCode;
    selectColorButtonTitle.textContent = defaultColor.title;
  }

  function renderSelectListItems(
    newProjectEditorSelectColorList,
    newProjectEditorSelectColorButton,
    tickItemClassForVisibleState,
    colors,
  ) {
    const valueName = newProjectEditorSelectColorList.dataset.name;
    const selectPopupTicks = allTicks[valueName];

    const selectButtonTitleElement = newProjectEditorSelectColorButton.querySelector(
      '.new-project-editor-select-button__title',
    );
    const selectButtonIconElement = newProjectEditorSelectColorButton.querySelector(
      '.new-project-editor__color-circle',
    );

    renderInitialSelectButtonUI(defaultColor, selectButtonTitleElement, selectButtonIconElement);

    colors.forEach((color, index) => {
      const selectListItemClone = newProjectEditorSelectListItemTemplate.content.cloneNode(true);
      const selectListItem = selectListItemClone.querySelector('.new-project-editor__select-item');

      selectListItem.setAttribute('data-hexCode', color.hexCode);

      const selectListItemTick = selectListItem.querySelector(
        '.new-project-editor-select-item__tick',
      );

      selectPopupTicks.push(selectListItemTick);

      if (index === 0) {
        showTick(selectListItemTick, tickItemClassForVisibleState);
      }

      const selectListItemColorCircle = selectListItem.querySelector(
        '.new-project-editor__color-circle',
      );
      selectListItemColorCircle.style.backgroundColor = color.hexCode;

      const selectListItemTitle = selectListItem.querySelector(
        '.new-project-editor-select-item__title',
      );

      selectListItemTitle.textContent = color.title;

      selectListItem.addEventListener('click', () =>
        handlePopupItemClick(
          valueName,
          color,
          selectButtonTitleElement,
          selectButtonIconElement,
          updatePopupButtonTextElement,
          updatePopupButtonIconElement,
          updateNewDataValues,
          selectPopupTicks,
          selectListItemTick,
          tickItemClassForVisibleState,
        ),
      );

      newProjectEditorSelectColorList.append(selectListItem);
    });
  }

  function resetNewProjectDataValues() {
    newProjectDataValues = {
      title: '',
      color: defaultColor,
    };
  }

  function updatePopupButtonTextElements() {
    selectButtonTitles.forEach((selectButtonTitle) => {
      const valueName = selectButtonTitle.dataset.name;
      selectButtonTitle.textContent = newProjectDataValues[valueName].title;
    });
  }

  function updatePopupButtonIconElements() {
    selectButtonIcons.forEach((selectButtonIcon) => {
      const valueName = selectButtonIcon.dataset.name;
      selectButtonIcon.style.backgroundColor = newProjectDataValues[valueName].hexCode;
    });
  }

  function updatePopupButtonTextElement(popupButtonTextElement, valueName) {
    popupButtonTextElement.textContent = newProjectDataValues[valueName].title;
  }

  function updatePopupButtonIconElement(popupButtonIconElement, valueName) {
    popupButtonIconElement.style.backgroundColor = newProjectDataValues[valueName].hexCode;
  }

  function clearAllInputsValues() {
    inputs.forEach((input) => {
      input.value = '';
    });
  }

  /* event's handlers */

  function handleProjectNavigationListItemClick(projectNavigationButton, projectNavigationButtons) {
    removeHighlighterFromPrevioslySelectedProjectNavigationButton(projectNavigationButtons);
    highlightProjectNavigationButton(projectNavigationButton);
  }

  function handleAddNewProjectButtonClick(newProjectEditorOverlay, editorClassForVisibleState) {
    openPopup(newProjectEditorOverlay, editorClassForVisibleState);
  }

  function handleProjectNavigationChevronButton() {
    switchChevronState();
    toggleChevronButtonStyles();
    toggleListItemsVisibilityState();
  }

  function handleInputChange(e, addButton, inputs) {
    const input = e.currentTarget;
    const valueName = input.name;
    newProjectDataValues[valueName] = input.value;

    toggleAddButtonDisabledState(isFormValid(inputs), addButton);
  }

  function handleAddTaskButtonClick(
    popup,
    classForVisibleState,
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  ) {
    const newProject = createProjectWithUniqueId(newProjectDataValues);
    projects.push(newProject);

    clearProjectNavigationList(projectNavigationList);

    renderProjectNavigationListItems(
      projectNavigationList,
      projectNavigationListItemTemplate,
      projects,
    );

    closePopup(popup, classForVisibleState);
  }

  /* event's listeners */

  addNewProjectButton.addEventListener('click', () =>
    handleAddNewProjectButtonClick(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  projectNavigationChevronButton.addEventListener('click', () =>
    handleProjectNavigationChevronButton(newProjectEditorOverlay, OVERLAY_CLASS_FOR_VISIBLE_STATE),
  );

  newProjectTitle.addEventListener('input', (e) =>
    handleInputChange(e, addTaskButton, newProjectTitle),
  );

  newProjectEditorSelectColorButton.addEventListener('click', () =>
    togglePopup(newProjectEditorSelectColorPopup, SELECT_POPUP_CLASS_FOR_VISIBLE_STATE),
  );

  addTaskButton.addEventListener('click', () => {
    handleAddTaskButtonClick(
      newProjectEditorOverlay,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      projectNavigationList,
      projectNavigationListItemTemplate,
      projects,
    );
  });

  newProjectEditorOverlay.addEventListener('click', (e) =>
    handleEditorOverlayClick(
      e,
      newProjectEditorSelectPopupsNodeList,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  document.addEventListener('click', (e) =>
    handleClickOutsidePopup(
      e,
      newProjectEditorSelectColorPopup,
      selectColorContainerChildrenList,
      SELECT_POPUP_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  cancelButton.addEventListener('click', () =>
    handleCancelButtonClick(
      newProjectEditorOverlay,
      updatePopupButtonTextElements,
      updatePopupButtonIconElements,
      OVERLAY_CLASS_FOR_VISIBLE_STATE,
      clearAllInputsValues,
      resetNewProjectDataValues,
      allTicks,
      SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    ),
  );

  renderProjectNavigationListItems(
    projectNavigationList,
    projectNavigationListItemTemplate,
    projects,
  );

  renderSelectListItems(
    newProjectEditorSelectColorList,
    newProjectEditorSelectColorButton,
    SELECT_ITEM_TICK_CLASS_FOR_VISIBLE_STATE,
    colors,
  );
}

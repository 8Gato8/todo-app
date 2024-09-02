class Task {
  #isDone = false;
  #id;
  #title;
  #description;
  #project;
  #dueDate;
  #priority;
  #notes;
  #checklist;

  constructor({
    title,
    description = '',
    dueDate,
    priority,
    notes = '',
    checklist = [],
    project,
    id,
  }) {
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#notes = notes;
    this.#checklist = checklist;
    this.#project = project;
    this.#id = id;
  }

  get title() {
    return this.#title;
  }
  set title(newTitle) {
    this.#title = newTitle;
  }

  get description() {
    return this.#description;
  }
  set description(newDescription) {
    this.#description = newDescription;
  }

  get priority() {
    return this.#priority;
  }
  set priority(newPriority) {
    this.#priority = newPriority;
  }

  get isDone() {
    return this.#isDone;
  }
  set isDone(newStatus) {
    this.#isDone = newStatus;
  }

  get project() {
    return this.#project;
  }
  set project(newProject) {
    this.#project = newProject;
  }

  get dueDate() {
    return this.#dueDate;
  }
  set dueDate(newDueDate) {
    this.#dueDate = newDueDate;
  }

  get notes() {
    return this.#notes;
  }
  set notes(newNotes) {
    this.#notes = newNotes;
  }

  get checklist() {
    return this.#checklist;
  }

  addItemsToChecklist(newItems) {
    this.#checklist.push(newItems);
  }

  removeItemFromChecklist(itemToRemoveId) {
    this.#checklist = this.#checklist.filter((item) => item.id !== itemToRemoveId);
  }

  get id() {
    return this.#id;
  }
}

export default function createTask(newTaskData) {
  return new Task(newTaskData);
}

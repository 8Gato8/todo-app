class Project {
  #title;
  #tasks = [];

  constructor({ title }) {
    this.#title = title;
  }

  get title() {
    return this.#title;
  }
  set title(newTitle) {
    this.#title = newTitle;
  }

  get tasks() {
    return this.#tasks;
  }

  addTask(newTask) {
    this.#tasks.push(newTask);
  }

  removeTaskById(taskToRemoveId) {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskToRemoveId);
  }
}

export default function createProject(newProjectData) {
  return new Project(newProjectData);
}

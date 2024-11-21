class Project {
  #title;
  #id;
  #tasks = [];
  #color;

  constructor({ title, id, color }) {
    this.#title = title;
    this.#id = id;
    this.#color = color;
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

  get id() {
    return this.#id;
  }

  get color() {
    return this.#color;
  }

  set color(newColor) {
    this.#color = newColor;
  }

  edit(newProjectData) {
    this.title = newProjectData.title;
    this.color = newProjectData.color;
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

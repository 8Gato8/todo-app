import generateUniqueId from './generateUniqueId';
import createProject from '../project';
export default function createProjectWithUniqueId(newProjectData) {
  const id = generateUniqueId();

  const newProject = createProject({ ...newProjectData, id });
  return newProject;
}

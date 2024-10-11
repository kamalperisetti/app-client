import { useEffect, useState } from 'react';

import ProjectCard from '../projectCard';
import { ProjectPlane } from '../Types/types';

import './index.css';
const months: number[] = [];
for (let i = 2; i <= 8; i++) {
  months.push(i);
}

const ProjectView = () => {
  const [projectItem, setProject] = useState<ProjectPlane[]>([]);

  useEffect(() => {
    const getProjectDetails = async () => {
      const url = 'http://localhost:8080/games/game1/projectPlans?ownerId=bharath1';

      const request = await fetch(url);
      const jsonRes = await request.json();

      if (jsonRes && jsonRes.length > 0 && jsonRes[0].project) {
        setProject(jsonRes);
      } else {
        console.log('projectItem[0] or project is undefined');
      }
    };
    getProjectDetails();
  }, []);

  console.log(projectItem);

  return (
    <div className="months-con">
      <ul className="months">
        {months.map((each, index) => (
          <ul className="each-month" key={index}>
            <li className="month-head">{each}</li>
            <li className="gap-con"></li>
            <li className="empty-con"></li>
            <li className="empty-con"></li>
            <li className="empty-con"></li>
          </ul>
        ))}
      </ul>

      <div>{projectItem.length > 0 && <ProjectCard single={projectItem[0].project} />}</div>
    </div>
  );
};
export default ProjectView;

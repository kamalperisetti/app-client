import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import ProjectCard from '../projectCard';
import { projectType } from '../Types/types';
import './index.css';

const months: number[] = [];
for (let i = 2; i <= 8; i++) {
  months.push(i);
}

interface ProposType {
  project: projectType;
  projectStartTime: number;
}

const ProjectView = (props: ProposType) => {
  const { project, projectStartTime } = props;
  const [projectItem, setProject] = useState<projectType>(project);
  const [currentColumn, setCurrentColumn] = useState(project.initialStartTime); // Initialize column to 2
  console.log(projectStartTime, 'PP');
  const cardSpan = 3;
  // const cardSpan = 4; // Card spans 3
  const nodeRef = useRef(null); // Ref for draggable card

  // useEffect(() => {
  //   const getProjectDetails = async () => {
  //     const url = 'http://localhost:8080/games/game1/projectPlans?ownerId=bharath1';
  //     const request = await fetch(url);
  //     const jsonRes = await request.json();

  //     if (jsonRes && jsonRes.length > 0 && jsonRes[0].project) {
  //       setProject(jsonRes);
  //     } else {
  //       console.log('projectItem[0] or project is undefined');
  //     }
  //   };
  //   getProjectDetails();
  // }, []);

  // Handle drag stop event
  const handleDragStop = (e: any, data: any) => {
    // Calculate the new column based on drag position
    const newColumn = Math.round(data.x / ((window.innerWidth * 0.7) / 7)) + 2; // Adjust calculation for 75% width

    // Ensure card stays within columns 2 to 8
    if (newColumn >= 2 && newColumn <= 8 && newColumn + cardSpan - 1 <= 8) {
      setCurrentColumn(newColumn);
    }
  };

  return (
    <div
      className="months-con"
      style={{
        position: 'relative',
        // Set width to 75% of the parent container
        margin: '0 auto', // Center the component horizontally
      }}
    >
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

      <div>
        {/* {projectItem.length > 0 && ( */}
        <Draggable
          nodeRef={nodeRef}
          axis="x"
          bounds={{
            left: 0,
            right: (8 - cardSpan) * ((window.innerWidth * 0.72) / 7), // Adjust bounds for 75% width
          }}
          grid={[(window.innerWidth * 0.72) / 7, (window.innerWidth * 0.72) / 7]} // Snap to column widths based on 75% width
          position={{ x: (currentColumn - 2) * ((window.innerWidth * 0.72) / 7), y: 0 }}
          onStop={handleDragStop}
        >
          {/* Draggable project card */}
          <div
            ref={nodeRef}
            className="project-card-con"
            style={{
              position: 'absolute',
              width: `${cardSpan * 13.8}%`,
            }}
            // Stop dragging if the mouse leaves the element
          >
            {/* {projectItem.length > 0 &&  */}
            <ProjectCard single={projectItem} />
            {/* } */}
          </div>
        </Draggable>
        {/* )} */}
      </div>

      {/* Display the current column */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>Current Column: {currentColumn}</div>
    </div>
  );
};

export default ProjectView;

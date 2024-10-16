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
  const [projectStartEndTime, setProjectStartEndTime] = useState({ start: project.initialStartTime, end: project.initialFinishTime });
  const [currentColumn, setCurrentColumn] = useState(projectStartTime); // Initialize column to 2

  // Make api call when user changed time

  const cardSpan = parseInt(localStorage.getItem('projectLength') || '0');
  // const cardSpan = 4; // Card spans 3
  const nodeRef = useRef(null); // Ref for draggable card

  // Handle drag stop event
  const handleDragStop = (e: any, data: any) => {
    // Calculate the new column based on drag position
    const newColumn = Math.round(data.x / ((window.innerWidth * 0.7) / 7)) + 2; // Adjust calculation for 75% width

    // Ensure card stays within columns 2 to 8
    if (newColumn >= 2 && newColumn <= 8 && newColumn + cardSpan - 1 <= 8) {
      setCurrentColumn(newColumn);
      let diff = project.initialFinishTime - project.initialStartTime;
      setProjectStartEndTime({ start: newColumn, end: newColumn + diff });
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
        <Draggable
          nodeRef={nodeRef}
          axis="x"
          bounds={{
            left: 0,
            right: (8 - cardSpan) * ((window.innerWidth * 0.72) / 7), // Adjust bounds for 75% width
          }}
          grid={[(window.innerWidth * 0.78) / 7, (window.innerWidth * 0.78) / 7]} // Snap to column widths based on 75% width
          position={{ x: (currentColumn - 2) * ((window.innerWidth * 0.78) / 7), y: 0 }}
          onStop={handleDragStop}
        >
          <div
            ref={nodeRef}
            className="project-card-con"
            style={{
              position: 'absolute',
              width: `${cardSpan * 13.8}%`,
            }}
            // Stop dragging if the mouse leaves the element
          >
            <ProjectCard single={projectItem} projectStartEndTime={projectStartEndTime} />
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default ProjectView;

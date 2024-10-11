import { MouseEvent, useMemo, useState } from 'react';

import { FaRegClock } from 'react-icons/fa';
import { FaDiamond, FaHeart } from 'react-icons/fa6';
import { ImSpades } from 'react-icons/im';
import { projectType } from '../Types/types';
import './index.css';
type projectPropsType = {
  single: projectType;
};
interface FrequencyCounter {
  [key: string]: number; // The key is the string, and the value is the frequency
}

// Change demands data formate
const changeDataFormate = (data: projectType) => {
  const newDemandsList: FrequencyCounter[] = [];
  for (let i = 0; i < data.initialFinishTime - data.initialStartTime + 1; i++) {
    let obj: FrequencyCounter = { HEART: 0, DIAMOND: 0, SPADE: 0 };
    for (let j = 0; j < data.demands.length; j++) {
      // To check time
      if (i === data.demands[j].time) {
        // If obj has that data already then increase count
        obj[data.demands[j].skill]++;
      }
    }
    newDemandsList.push(obj);
  }
  return newDemandsList;
};

const ProjectCard = (props: projectPropsType) => {
  const { single } = props;
  const [isDragging, setIsDragging] = useState<boolean>(false); // Track drag state
  const [startX, setStartX] = useState<number>(0); // Track initial mouse position
  const [marginLeft, setMarginLeft] = useState<number>((single.initialStartTime - 2) * 157); // State for left margin
  const [columnNumber, setColumnNumber] = useState<number>(1); // State for column number

  let diff = single.initialFinishTime - single.initialStartTime;
  // max width as percantage

  const dataFormat = useMemo(() => {
    return changeDataFormate(single);
  }, []);

  //Get length of
  const dataFormatLength = dataFormat.length;

  const maxColumns = 5; // Max columns (limit for drag range)
  const columnWidth = 150; // Width between columns

  const minMargin = 0; // Minimum margin (leftmost boundary)
  const maxMargin = (maxColumns - 0.9) * columnWidth; // Max margin (rightmost boundary)

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true); // Start dragging
    setStartX(event.clientX); // Track where the drag starts
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX; // Calculate how far the mouse has moved
    const newMarginLeft = marginLeft + deltaX; // Calculate new margin

    // Restrict movement within the min/max margins
    if (newMarginLeft >= minMargin && newMarginLeft <= maxMargin) {
      setMarginLeft(newMarginLeft); // Update the margin
      const newColumnNumber = Math.round(newMarginLeft / columnWidth) + 1;
      setColumnNumber(newColumnNumber); // Update column number
    }

    setStartX(event.clientX); // Update the start position for smooth dragging
  };

  const handleMouseUp = () => {
    setIsDragging(false); // Stop dragging
  };

  return (
    <div
      className="project-card-con"
      style={{
        width: `${dataFormatLength * 14.2}%`,
        cursor: isDragging ? 'grabbing' : 'grab',
        marginLeft: `${marginLeft}px`,
        position: 'absolute',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <nav className="project-head" style={{ fontSize: `${dataFormatLength * 3.5}px` }}>
        <h2 style={{ fontSize: '15px', fontFamily: 'sans-serif' }}>{single.name}</h2>
        <div className="time-container">
          <FaRegClock style={{ fontSize: `${dataFormatLength * 5.5}px` }} />
          <h2 style={{ fontSize: `${dataFormatLength * 5.5}px` }}>
            {single.initialStartTime} - {single.initialFinishTime}
          </h2>
        </div>
      </nav>
      <ul className="months">
        {dataFormat.map((each, index) => (
          <ul className="each-demand-con" key={index}>
            <li className="empty-con">
              {each.HEART > 0 && (
                <p>
                  {each.HEART} x <FaHeart className="heart-icon" />
                </p>
              )}
            </li>
            <li className="empty-con">
              {each.DIAMOND > 0 && (
                <p>
                  {each.DIAMOND} x <FaDiamond className="heart-icon" />
                </p>
              )}{' '}
            </li>
            <li className="empty-con">
              {each.SPADE > 0 && (
                <p>
                  {' '}
                  {each.SPADE} x <ImSpades />
                </p>
              )}
            </li>
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default ProjectCard;

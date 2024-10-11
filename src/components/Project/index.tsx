import { useState } from 'react';
import { BsFillSuitSpadeFill } from 'react-icons/bs';
import { FaDiamond } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';
import { ImCross } from 'react-icons/im';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import logo from '../../assets/texgo0cy.png';
import ProjectView from '../ProjectView';
import { projectType, ResourceCard } from '../Types/types';
import './index.css';

interface ProjectProps {
  resourceCard: ResourceCard[];
  projectId: string | undefined;
  // updateResourceCards(resourceCard: ResourceCard[]): void;
  project: projectType;
  projectStartTime: number;
}

const Project = (props: ProjectProps) => {
  let months = [2, 3, 4, 5, 6, 7, 8];
  // const gameId = '1';

  let { resourceCard, projectId, project, projectStartTime } = props;
  const [resourceIndex, setResourceIndex] = useState<number>();
  const [resourceSkill, setResourceSkill] = useState<string>();
  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [showResourceCard, setShowResourceCard] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');
  console.log(projectStartTime, 'III');
  // console.log(project);
  // const sendResourceCardToRM = async (card: ResourceCard) => {
  //   const url = `http://localhost:8080/game/game-id/request/${gameId}/return`;
  //   const option = {
  //     method: 'POST',

  //     headers: {
  //       'Content-Type': 'application/json',
  //     },

  //     body: JSON.stringify({ ...card, projectId: projectId }),
  //   };

  //   resourceCard = resourceCard.filter((each) => card.id !== each.id);
  //   // updateResourceCards(resourceCard);
  //   try {
  //     const cardSending = await fetch(url, option);
  //     const data = await cardSending.text();
  //     toast(data);
  //   } catch (e: any) {
  //     console.log(e.message);
  //   }
  // };

  const showRequestBtn = (e: React.MouseEvent<HTMLDivElement>, index: number, skill: string) => {
    e.preventDefault();
    if (isRequested || showResourceCard) {
      toast('You Can Make One Request At a Time Wait Until It Resolve Or Cancel Your Request');
      return;
    }

    setIsRequested(true);

    setResourceIndex(index);
    setResourceSkill(skill);
  };

  const sendRequestToRM = (index: number, skill: string) => {
    const id = uuidv4();
    const resourceCard = {
      id: id,
      targetProjectBoardId: projectId,
      demand: {
        time: index,
        skill: skill,
      },
    };
    setShowResourceCard(true);
    setIsRequested(false);
    setRequestId(id);
    console.log(resourceCard, 'HII BAYYA');
  };

  const cancelTheRequest = () => {
    console.log(requestId, 'Canceled');
    setShowResourceCard(false);
  };

  const renderCards = (skill: 'HEART' | 'DIAMOND' | 'SPADE', index: number) => {
    const cards = resourceCard.filter((c) => c.time === index && c.skill === skill);
    const Icon = skill === 'HEART' ? GoHeartFill : skill === 'DIAMOND' ? FaDiamond : BsFillSuitSpadeFill;

    if (cards.length > 0) {
      return (
        <div className={`cards card${skill === 'HEART' ? '1' : skill === 'DIAMOND' ? '2' : '3'}`} onContextMenu={(e) => showRequestBtn(e, index, skill)}>
          {isRequested === true && resourceIndex === index && resourceSkill === skill && (
            <div className="request-btn-container">
              <button className="request-btn" onClick={() => sendRequestToRM(index, skill)}>
                Request
              </button>
              <button className="cancel-request-btn request-btn">
                <ImCross onClick={() => setIsRequested(false)} style={{ fontSize: '11px' }} />
              </button>
            </div>
          )}
          {showResourceCard === true && resourceIndex === index && resourceSkill === skill && (
            <div className="request-resource-card-container">
              <div className="request-name-and-heart-container">
                <h3 className="skill-holder-name">?</h3>
                <Icon className="request-name-and-heart" />
              </div>
              <div className="request-month-and-skill-container">
                <h2 className="month-details">{index + 2}</h2>
                <Icon className="request-month-and-skill-heart" />
              </div>
              <div onClick={cancelTheRequest} className="cross-icon-container">
                <ImCross className="cross-icon" />
              </div>
            </div>
          )}
          {cards.map((card, cardIndex) => (
            <div
              key={cardIndex}
              className="resource-card-container"
              style={{
                position: 'absolute',
                top: cardIndex === 0 ? '8px' : `${cardIndex * 30}px`,
                left: cardIndex === 0 ? '10px' : `${cardIndex * 25}px`,
                zIndex: cardIndex + 1,
              }}
            >
              <div className="name-and-heart-container">
                <h5 className="skill-holder-name">{card.name}</h5>
                <span>
                  <Icon className="name-and-heart" />
                </span>
              </div>
              <div className="month-and-skill-container">
                <h2 className="month-details">{card.time + 2}</h2>
                <Icon className="month-and-skill-heart" />
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className={`cards card${skill === 'HEART' ? '1' : skill === 'DIAMOND' ? '2' : '3'}`} onContextMenu={(e) => showRequestBtn(e, index, skill)}>
          <Icon style={{ color: 'rgb(108, 111, 138)', fontSize: '30px' }} />
          {isRequested === true && resourceIndex === index && resourceSkill === skill && (
            <div className="request-btn-container">
              <button className="request-btn" onClick={() => sendRequestToRM(index, skill)}>
                Request
              </button>
              <button className="cancel-request-btn request-btn">
                <ImCross onClick={() => setIsRequested(false)} style={{ fontSize: '11px' }} />
              </button>
            </div>
          )}
          {showResourceCard === true && resourceIndex === index && resourceSkill === skill && (
            <div className="request-resource-card-container">
              <div className="request-name-and-heart-container">
                <h3 className="skill-holder-name">?</h3>
                <Icon className="request-name-and-heart" />
              </div>
              <div className="request-month-and-skill-container">
                <h2 className="month-details">{index + 2}</h2>
                <Icon className="request-month-and-skill-heart" />
              </div>
              <div onClick={cancelTheRequest} className="cross-icon-container">
                <ImCross className="cross-icon" />
              </div>
            </div>
          )}
        </div>
      );
    }
  };
  return (
    <div className="project-display">
      <div className="time-container">
        <p className="plan-title">Time (t) ——＞</p>
        <h3 className="plan-title">Project Plan</h3>
        <img className="logo-image" src={logo} alt="company-logo" />
      </div>
      <ProjectView project={project} projectStartTime={projectStartTime} />
      <div>
        {resourceCard !== undefined && (
          <div className="resource-card-main-container">
            {months.map((month, index) => (
              <div key={month} className="cards-container">
                {renderCards('HEART', index)}
                {renderCards('DIAMOND', index)}
                {renderCards('SPADE', index)}
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Project;

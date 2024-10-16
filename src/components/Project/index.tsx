import { useEffect, useState } from 'react';
import { BsFillSuitSpadeFill } from 'react-icons/bs';
import { FaDiamond } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';
import { ImCross } from 'react-icons/im';
// import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/texgo0cy.png';
import ProjectView from '../ProjectView';
import { Owner, projectType, ResourceCard } from '../Types/types';
import './index.css';

interface ProjectProps {
  resourceCard: ResourceCard[];
  projectId: string | undefined;
  project: projectType;
  projectStartTime: number;
  owner: Owner;
  // setErrMsg: string;
  setErrMsg: React.Dispatch<React.SetStateAction<string | null>>;
}

const Project = (props: ProjectProps) => {
  let months = [2, 3, 4, 5, 6, 7, 8];

  let { resourceCard, projectId, project, projectStartTime, owner, setErrMsg } = props;
  const [resourceIndex, setResourceIndex] = useState<number>();
  const [resourceSkill, setResourceSkill] = useState<string>();
  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [requestResponse, setRequestResponse] = useState('');
  const [showResourceCard, setShowResourceCard] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');
  const { gameId } = useParams();
  // const gameId = 'sd';
  // setErrMsg('Game Not Found');
  useEffect(() => {
    console.log('request triggered');
  }, [requestResponse]);

  const showRequestBtn = (e: React.MouseEvent<HTMLDivElement>, index: number, skill: string) => {
    e.preventDefault();
    if (isRequested || showResourceCard) {
      return;
    }
    setIsRequested(true);
    setResourceIndex(index);
    setResourceSkill(skill);
  };

  const cancelTheRequest = async () => {
    setShowResourceCard(false);
    const url = `http://localhost:8080/game/${gameId}/request/${requestId}/return`;
    const option = {
      method: 'GET',
    };
    const response = await fetch(url, option);
    const err = await response.text();
    if (err.startsWith('Game')) {
      setErrMsg(err);
    }
  };

  const renderCards = (skill: 'HEART' | 'DIAMOND' | 'SPADE', month: number) => {
    const cards = resourceCard.filter((c) => c.time === month && c.skill === skill);
    const Icon = skill === 'HEART' ? GoHeartFill : skill === 'DIAMOND' ? FaDiamond : BsFillSuitSpadeFill;

    if (cards.length > 0) {
      return (
        <div className={`cards card${skill === 'HEART' ? '1' : skill === 'DIAMOND' ? '2' : '3'}`} onContextMenu={(e) => showRequestBtn(e, month, skill)}>
          {isRequested === true && resourceIndex === month && resourceSkill === skill && (
            <div className="request-btn-container">
              <button className="request-btn" onClick={() => sendRequestToRM(month, skill)}>
                Request
              </button>
              <button className="cancel-request-btn request-btn">
                <ImCross onClick={() => setIsRequested(false)} style={{ fontSize: '11px' }} />
              </button>
            </div>
          )}
          {showResourceCard === true && resourceIndex === month && resourceSkill === skill && (
            <div className="request-resource-card-container">
              <div className="request-name-and-heart-container">
                <h3 className="requested skill-holder-name ">?</h3>
                <Icon className="request-name-and-heart" />
              </div>
              <div className="request-month-and-skill-container">
                <h2 className="month-details">{month}</h2>
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
                top: cards.length === 1 ? '50px' : cardIndex === 0 ? '5px' : `${cardIndex * 19}px`,
                left: cards.length === 1 ? '35px' : cardIndex === 0 ? '10px' : cardIndex >= 3 ? `${(cardIndex - 2.8) * 25}px` : `${cardIndex * 25}px`,
              }}
            >
              <div className={`${skill === `HEART` || skill === `DIAMOND` ? `name-and-heart-container ` : `name-and-heart-container `}`}>
                <h5 className="skill-holder-name">{card.name}</h5>
                <span>
                  <Icon className={`${skill === `HEART` || skill === `DIAMOND` ? `red-color name-and-heart ` : `black-color name-and-heart `}`} />
                </span>
              </div>
              <div
                className={`${skill === `HEART` || skill === `DIAMOND` ? `month-and-skill-container red-color-backgound` : `month-and-skill-container black-color-backgound`}`}
              >
                <h2 className="month-details">{card.time + 2}</h2>
                <Icon className={`${skill === `HEART` || skill === `DIAMOND` ? `red-color month-and-skill-heart ` : `black-color month-and-skill-heart `}`} />
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className={`cards card${skill === 'HEART' ? '1' : skill === 'DIAMOND' ? '2' : '3'}`} onContextMenu={(e) => showRequestBtn(e, month, skill)}>
          <Icon style={{ color: 'rgb(108, 111, 138)', fontSize: '30px' }} />
          {isRequested === true && resourceIndex === month && resourceSkill === skill && (
            <div className="request-btn-container">
              <button className="request-btn" onClick={() => sendRequestToRM(month, skill)}>
                Request
              </button>
              <button className="cancel-request-btn request-btn">
                <ImCross onClick={() => setIsRequested(false)} style={{ fontSize: '11px' }} />
              </button>
            </div>
          )}
          {showResourceCard === true && resourceIndex === month && resourceSkill === skill && (
            <div className="request-resource-card-container">
              <div className="request-name-and-heart-container">
                <h3 className="skill-holder-name requested">?</h3>
                <Icon className="request-name-and-heart" />
              </div>
              <div className="request-month-and-skill-container">
                <h2 className="month-details">{month + 2}</h2>
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
            {months.map((month) => (
              <div key={month} className="cards-container">
                {renderCards('HEART', month)}
                {renderCards('DIAMOND', month)}
                {renderCards('SPADE', month)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;

import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BsFillSuitSpadeFill } from 'react-icons/bs';
import { FaDiamond } from 'react-icons/fa6';
import { GoHeartFill } from 'react-icons/go';
import { ImCross } from 'react-icons/im';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from 'uuid';
import logo from '../../assets/texgo0cy.png';
// import AppContext from '../../Context/appContext';
import ProjectView from '../ProjectView';
import { ProjectPlane } from '../Types/types';
import './index.css';

const Project = ({ eachProject, setErrMsg }: { eachProject: ProjectPlane; setErrMsg: React.Dispatch<React.SetStateAction<string | null>> }) => {
  let months = [2, 3, 4, 5, 6, 7, 8];

  let { cards, id, project, projectStartTime, owner } = eachProject;
  // console.log(owner);

  const [resourceIndex, setResourceIndex] = useState<number>();
  const [resourceSkill, setResourceSkill] = useState<string>();
  const [isRequested, setIsRequested] = useState<boolean>(false);
  const [requestResponse, setRequestResponse] = useState('');
  const [showResourceCard, setShowResourceCard] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>('');
  const { gameId } = useParams();
  // const { allProjects, changeErrorState } = useContext(AppContext);
  // console.log(allProjects, 'HII MY GOODD BOYS');
  useEffect(() => {
    console.log('request triggered');
  }, [requestResponse]);

  const showRequestBtn = (e: React.MouseEvent<HTMLDivElement>, index: number, skill: string) => {
    e.preventDefault();
    let projectStartMonth = projectStartTime;
    console.log(projectStartMonth);
    // changeErrorState('MY BOSSS');

    const diffrence = project.initialFinishTime - projectStartTime;
    const projectEndTime = projectStartTime + diffrence;
    let isTrue = false;
    for (projectStartMonth; projectStartMonth <= projectEndTime; projectStartMonth++) {
      if (projectStartMonth === index) {
        isTrue = true;
      }
    }

    // console.log(isRequested);
    // console.log(isTrue, 'checking is true');
    // console.log(index);

    if (isRequested || showResourceCard) {
      toast.error('You can make one request at a time', {
        style: {
          borderRadius: '10px',
          background: '#333',
          fontSize: '18px',
          minWidth: '600px',
          textAlign: 'center',
          color: '#fff',
        },
        duration: 1500,
      });
      return;
    }
    if (!isTrue) {
      toast.error('Please make a request from the project start month to project end month', {
        style: {
          borderRadius: '10px',
          background: '#333',
          fontSize: '18px',
          minWidth: '600px',
          textAlign: 'center',
          color: '#fff',
        },
        duration: 1500,
      });
      return;
    }
    setIsRequested(true);
    setResourceIndex(index);
    setResourceSkill(skill);
  };

  const sendRequestToRM = (month: number, skill: string) => {
    const resourceCardId = uuidv4();
    const cards = {
      id: resourceCardId,
      targetProjectBoardId: id,
      projectPlanId: project.id,
      playerId: 'bharath3',
      demand: {
        time: month,
        skill: skill,
      },
    };
    console.log(cards, 'KII');
    const socket = new SockJS('http://localhost:8080/rmg');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to web Socket');
        stompClient.subscribe('/topic/request', (message) => {
          setRequestResponse(message.body);
          console.log(message.body);
        });
        stompClient.publish({ destination: '/app/game/GameId1/request', body: JSON.stringify(cards) });
      },

      onStompError: (frame) => {
        console.error('Broker Error: ' + frame.headers['message']);
      },
    });
    stompClient.activate();

    setShowResourceCard(true);
    setIsRequested(false);
    setRequestId(id);
  };

  const cancelTheRequest = async () => {
    setShowResourceCard(false);
    const url = `http://localhost:8080/game/${gameId}/request/${requestId}/return`;
    const option = {
      method: 'GET',
    };
    const response = await fetch(url, option);
    const err = await response.text();

    if (response.ok) {
      toast.success(err, {
        style: {
          borderRadius: '10px',
          fontSize: '18px',
          minWidth: '600px',
          textAlign: 'center',
          // color: '#fff',
        },
        duration: 1500,
      });
    } else {
      toast.error(err, {
        style: {
          borderRadius: '10px',
          fontSize: '18px',
          minWidth: '600px',
          textAlign: 'center',
        },
        duration: 1500,
      });
    }
    if (err.startsWith('Game')) {
      setErrMsg(err);
    }
  };

  const renderCards = (skill: 'HEART' | 'DIAMOND' | 'SPADE', month: number) => {
    const filteredCards = cards.filter((c) => c.time === month && c.skill === skill);
    const Icon = skill === 'HEART' ? GoHeartFill : skill === 'DIAMOND' ? FaDiamond : BsFillSuitSpadeFill;
    if (filteredCards.length > 0) {
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
          {filteredCards.map((card, cardIndex) => (
            <div
              key={cardIndex}
              className="resource-card-container"
              style={{
                position: 'absolute',
                top: filteredCards.length === 1 ? '50px' : cardIndex === 0 ? '5px' : `${cardIndex * 19}px`,
                left: filteredCards.length === 1 ? '35px' : cardIndex === 0 ? '10px' : cardIndex >= 3 ? `${(cardIndex - 2.8) * 25}px` : `${cardIndex * 25}px`,
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
                <h2 className="month-details">{card.time}</h2>
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
              <button onClick={() => setIsRequested(false)} className="cancel-request-btn request-btn">
                <ImCross style={{ fontSize: '11px' }} />
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
                <h2 className="month-details">{month}</h2>
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
        {cards !== undefined && (
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
      <Toaster />
    </div>
  );
};

export default Project;

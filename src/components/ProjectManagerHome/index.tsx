import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
// import AppContext from '../../Context/appContext';
import Project from '../Project';
import { Owner, ProjectPlane } from '../Types/types';
import './index.css';

const ProjectManagerHome = () => {
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [player, setPlayer] = useState<Owner>();

  const [searchParams] = useSearchParams();
  const [requestFullfilled, setRequestFullfilled] = useState('');
  const [socketObject, setSocketObject] = useState<Client | null>();
  const playerId: string | null = searchParams.get('ownerId');
  const [porjectChanged, setProjectChanged] = useState<String>('');
  console.log(porjectChanged);

  const { gameId } = useParams();

  const getTheProjectDataByPlayerId = async (gameId: string, playerId: string) => {
    const url = `http://localhost:8080/games/${gameId}/projectPlans?ownerId=${playerId}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setAllProject(data);
    } else {
      const message = await response.text();
      setErrMsg(message);
    }
  };

  const getThePlayerByPlayerId = async (gameId: string, playerId: string) => {
    const url = `http://localhost:8080/games/${gameId}/players/${playerId}`;
    const option = {
      method: 'GET',
    };
    const response = await fetch(url, option);
    if (response.ok) {
      const data = await response.json();
      setPlayer(data);
    } else {
      setErrMsg(await response.text());
    }
  };

  // Establish websocket connection
  const establishWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/rmg');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('connected for project change time ');
        stompClient.subscribe('/topic/moveProject', (message) => {
          //console.log(message.body);
          //changeTime(message.body);
          setProjectChanged(message.body);
        });
        stompClient.subscribe('/topic/request', (message) => {});

        // stompClient.publish({
        //   destination: `/app/games/GameId1/projectPlans/${id}/moveProject`,
        //   body: JSON.stringify(changeData),
        // });
      },
    });
    stompClient.activate();
    console.log(porjectChanged);
    setSocketObject(stompClient);
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId ?? '1', playerId ?? '1');
    getThePlayerByPlayerId(gameId ?? '1', playerId ?? '1');
    establishWebSocket();
  }, [porjectChanged, requestFullfilled]);
  return (
    <div className="background-image">
      {errMsg === null ? (
        <>
          {allProjects.length > 0 ? (
            <div className="main-container">
              {allProjects[0].owner.role === 'PM' && (
                <div className="project-display-main-container">
                  {allProjects.map((each: ProjectPlane) => (
                    <Project key={each.id} eachProject={each} setErrMsg={setErrMsg} socketClient={socketObject} setRequestFullfilled={setRequestFullfilled} />
                  ))}
                </div>
              )}
              <>
                {player !== undefined && (
                  <h3 className="playerName">
                    {player.name}-{player.role}
                  </h3>
                )}
              </>
            </div>
          ) : (
            <div className="not-found-btn-container">
              <button className="not-found-btn">Project Not Assigned</button>
            </div>
          )}
        </>
      ) : (
        <div className="not-found-btn-container">
          <button className="not-found-btn">{errMsg}</button>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerHome;

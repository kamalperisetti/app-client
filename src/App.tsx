import { useEffect, useState } from 'react';
import './App.css';
import Project from './components/Project';
import { ProjectPlane } from './components/Types/types';

function App() {
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const playerId: string = 'bharath1';
  const gameId: string = 'GameId1';

  const getTheProjectDataByPlayerId = async (gameId: string, playerId: string) => {
    const url = `http://localhost:8080/games/${gameId}/projectPlans?ownerId=${playerId}`;
    const option = {
      method: 'GET',
    };

    try {
      const response = await fetch(url, option);
      if (response.ok) {
        const data = await response.json();
        console.log(data, 'ALLL');
        setAllProject(data);
        setErrMsg(null);
      } else {
        const message = await response.text();
        setErrMsg(message);
        console.log(message);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId, playerId);
  }, []);

  return (
    <div className="background-image">
      {errMsg === null ? (
        <>
          {allProjects.length > 0 && (
            <div className="main-container">
              {allProjects[0].owner.role.startsWith('RM') && (
                <div className="project-display-main-container">
                  {allProjects.map((each: ProjectPlane) => (
                    <Project key={each.id} resourceCard={each.cards} projectId={each.id} project={each.project} projectStartTime={each.projectStartTime} />
                  ))}
                </div>
              )}
              <>
                <h3 className="playerName">
                  {allProjects[0].owner.name}-{allProjects[0].owner.role}
                </h3>
              </>
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
}

export default App;

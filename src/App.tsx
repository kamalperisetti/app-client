import { useEffect, useState } from 'react';
import './App.css';
import Project from './components/Project';
import { ProjectPlane } from './components/Types/types';

function App() {
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]);

  const playerId: string = 'bharath1';
  const gameId: string = '1';

  const getTheProjectDataByPlayerId = async (gameId: string, playerId: string) => {
    const url = `http://localhost:8080/games/${gameId}/projectPlans?ownerId=${playerId}`;
    const option = {
      method: 'GET',
    };
    const data = await fetch(url, option);
    const response = await data.json();
    console.log(response, 'ALLL');

    setAllProject(response);
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId, playerId);
  }, []);

  return (
    <div className="background-image">
      {allProjects.length > 0 && (
        <div className="main-container">
          <div className="prorject-display-main-container">
            {allProjects.map((each: ProjectPlane) => (
              <Project key={each.id} resourceCard={each.cards} projectId={each.id} project={each.project} projectStartTime={each.projectStartTime} />
            ))}
          </div>
          <>
            <h1>{allProjects[0].owner.name}</h1>
          </>
        </div>
      )}
    </div>
  );
}

export default App;

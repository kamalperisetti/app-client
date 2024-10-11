import { useEffect, useState } from 'react';
import './App.css';
import Project from './components/Project';
import { ProjectPlane } from './components/Types/types';

function App() {
  // const [projectId, setProjectId] = useState<string>();
  // const [resourceCard, setResourceCard] = useState<ResourceCard[]>([]);
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]);
  // console.log(allProjects[0].projectStartTime, 'Main');
  // const [projectId1, setProjectId1] = useState<string>();
  // const [resourceCard1, setResourceCard1] = useState<ResourceCard[]>([]);

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
    // setProjectId(response[0].id);
    // setResourceCard(response[0].cards);
    // setProjectId1(response[1].id);
    // setResourceCard1(response[1].cards);
    setAllProject(response);
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId, playerId);
  }, []);

  return (
    <div className="background-image">
      {allProjects.length > 0 && (
        <>
          {allProjects.map((each: ProjectPlane) => (
            <Project key={each.id} resourceCard={each.cards} projectId={each.id} project={each.project} projectStartTime={each.projectStartTime} />
          ))}
        </>
      )}
    </div>
  );
}

export default App;

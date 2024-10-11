import { useEffect, useState } from 'react';
import './App.css';
import Project from './components/Project';
import { ProjectPlane, ResourceCard } from './components/Types/types';

function App() {
  const [projectId, setProjectId] = useState<string>();
  const [resourceCard, setResourceCard] = useState<ResourceCard[]>([]);
  const [projects, setProject] = useState<ProjectPlane[]>([]);
  const [projectId1, setProjectId1] = useState<string>();
  const [resourceCard1, setResourceCard1] = useState<ResourceCard[]>([]);

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
    setProjectId(response[0].id);
    setResourceCard(response[0].cards);
    setProjectId1(response[1].id);
    setResourceCard1(response[1].cards);
    setProject(response);
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId, playerId);
  }, []);

  const updateResourceCards = (resourceCard: ResourceCard[]) => {
    setResourceCard(resourceCard);
  };

  return (
    <div className="background-image">
      {projects.map((each: ProjectPlane) => (
        <div key={each.id}>
          <Project resourceCard={each.cards} projectId={each.id} updateResourceCards={updateResourceCards} />
        </div>
      ))}
      {/* <Project resourceCard={resourceCard} projectId={projectId} updateResourceCards={updateResourceCards} />
      <Project resourceCard={resourceCard1} projectId={projectId1} updateResourceCards={updateResourceCards} /> */}
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import './App.css';
import Project from './components/Project';
import { ResourceCard } from './components/Types/types';

function App() {
  const [projectId, setProjectId] = useState<string>();
  const [resourceCard, setResourceCard] = useState<ResourceCard[]>([]);
  // console.log(projectId, 'projectId');

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
  };

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId, playerId);
  }, []);

  const updateResourceCards = (resourceCard: ResourceCard[]) => {
    setResourceCard(resourceCard);
  };

  return (
    <div className="background-image">
      <Project resourceCard={resourceCard} projectId={projectId} updateResourceCards={updateResourceCards} />
    </div>
  );
}

export default App;

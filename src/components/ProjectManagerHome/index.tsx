import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Project from '../Project';
import { ProjectPlane } from '../Types/types';
import './index.css';

const ProjectManagerHome = () => {
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]); // To store all projects
  const [errMsg, setErrMsg] = useState<string | null>(null);
  // console.log(allProjects, 'JIII');
  const [searchParams] = useSearchParams();
  const playerId: string | null = searchParams.get('playerId');

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

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId ?? '', playerId ?? '');
  }, []);

  return (
    <div className="background-image">
      {errMsg === null ? (
        <>
          {allProjects.length > 0 && (
            <div className="main-container">
              {allProjects[0].owner.role.startsWith('PM') && (
                <div className="project-display-main-container">
                  {allProjects.map((each: ProjectPlane) => (
                    <Project
                      key={each.id}
                      resourceCard={each.cards}
                      projectId={each.id}
                      project={each.project}
                      projectStartTime={each.projectStartTime}
                      owner={each.owner}
                    />
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
};

export default ProjectManagerHome;

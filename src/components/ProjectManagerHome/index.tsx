import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
// import AppContext from '../../Context/appContext';
import Project from '../Project';
import { Owner, ProjectPlane } from '../Types/types';
import './index.css';

const ProjectManagerHome = () => {
  const [allProjects, setAllProject] = useState<ProjectPlane[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [player, setPlayer] = useState<Owner>();
  const [searchParams] = useSearchParams();
  const playerId: string | null = searchParams.get('ownerId');
  // const [forTest, setForTest] = useState('');
  // console.log(forTest);
  // const onErrorOccurs = (e: string) => {
  //   setErrMsg(e);
  // };
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

  useEffect(() => {
    getTheProjectDataByPlayerId(gameId ?? '1', playerId ?? '1');
    getThePlayerByPlayerId(gameId ?? '1', playerId ?? '1');
  }, []);

  return (
    <div className="background-image">
      {errMsg === null ? (
        <>
          {allProjects.length > 0 ? (
            <div className="main-container">
              {allProjects[0].owner.role === 'PM' && (
                <div className="project-display-main-container">
                  {allProjects.map((each: ProjectPlane) => (
                    <Project key={each.id} eachProject={each} setErrMsg={setErrMsg} />
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
    // <AppContext.Provider
    //   value={{
    //     allProjects,
    //     changeErrorState: onErrorOccurs,
    //   }}
    // >
    //   <div className="background-image">
    //     {errMsg === '' ? (
    //       <>
    //         {allProjects.length > 0 ? (
    //           <div className="main-container">
    //             {allProjects[0].owner.role === 'PM' && (
    //               <div className="project-display-main-container">
    //                 {allProjects.map((each: ProjectPlane) => (
    //                   <Project key={each.id} eachProject={each} setErrMsg={setErrMsg} />
    //                 ))}
    //               </div>
    //             )}
    //             <>
    //               {player !== undefined && (
    //                 <h3 className="playerName">
    //                   {player.name}-{player.role}
    //                 </h3>
    //               )}
    //             </>
    //           </div>
    //         ) : (
    //           <div className="not-found-btn-container">
    //             <button className="not-found-btn">Project Not Assigned</button>
    //           </div>
    //         )}
    //       </>
    //     ) : (
    //       <div className="not-found-btn-container">
    //         <button className="not-found-btn">{errMsg}</button>
    //       </div>
    //     )}
    //   </div>
    // </AppContext.Provider>
  );
};

export default ProjectManagerHome;

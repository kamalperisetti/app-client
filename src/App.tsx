import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProjectManagerHome from './components/ProjectManagerHome';
import AppContext from './context/app';

function App() {
  return (
    <AppContext.Provider
      value={{
        userName: 'bharath',
        setUserName: () => {},
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/game/pm/:gameId" element={<ProjectManagerHome />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;

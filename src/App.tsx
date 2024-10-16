import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProjectManagerHome from './components/ProjectManagerHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/pm/:gameId" element={<ProjectManagerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PlannerPage from './pages/PlannerPage';
import ResultsPage from './pages/ResultsPage';
import VoicePage from './pages/VoicePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="planner" element={<PlannerPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="voice" element={<VoicePage />} />
      </Route>
    </Routes>
  );
}

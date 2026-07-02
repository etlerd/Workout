import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/ExerciseDetail'
import LogWorkout from './pages/LogWorkout'
import History from './pages/History'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import ProgramEditor from './pages/ProgramEditor'
import Progress from './pages/Progress'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExerciseDetail />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/log/:logId" element={<LogWorkout />} />
          <Route path="/history" element={<History />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/new" element={<ProgramEditor />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/programs/:id/edit" element={<ProgramEditor />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import MiroAuthorize from './features/miro/MiroAuthorize'
import PastWorkshop from './features/pastWorkshop/PastWorkshop'
import Help from './features/help/Help'
import Login from './features/auth/Login';
import Signup from './features/auth/Signup'
import WorkshopNotes from './features/pastWorkshop/WorkshopNotes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route path="dash" element={<DashLayout />}>

          <Route index element={<Welcome />} />

          <Route path="authorize">
            <Route index element={<MiroAuthorize />} />
          </Route>

          <Route path="pastWorkshop">
            <Route index element={<PastWorkshop />} />
            <Route path=":id" element={<WorkshopNotes />} />
          </Route>

          <Route path="help">
            <Route index element={<Help />} />
          </Route>

        </Route>{/* End Dash */}

      </Route>
    </Routes>
  );
}

export default App;

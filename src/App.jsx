import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Index from './pages/Index'
import SignUp from './pages/auth/SignUp'
import LogIn from './pages/auth/LogIn'
// import Profile from './pages/Profile'
import Error from './pages/Error'
import Private from './components/auth/Private'
import AllUsers from './pages/AllUsers'
import AllEvents from './pages/AllEvents'
import AllProjects from './pages/AllProjects'
import ListEvents from './components/ListEvents'
import DetailsUser from './pages/DetailsUser'
import ListProjects from './components/ListProjects'

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        {/* <Route path="/profile" element={<Private> <Profile /> </Private>} /> */}
        <Route path="/user/:userid" element={<DetailsUser/>}/>
        <Route path="/user" element={<AllUsers/>}/>
        <Route path="/event" element={<AllEvents/>}/>
        <Route path="/project" element={<AllProjects/>}/>
        <Route path="/error" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App

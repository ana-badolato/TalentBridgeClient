import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Index from './pages/Index'
import SignUp from './pages/auth/SignUp'
import LogIn from './pages/auth/LogIn'
import Profile from './pages/Profile'
import Error from './pages/Error'

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App

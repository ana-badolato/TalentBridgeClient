import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Index from './pages/Index'
import SignUp from './pages/auth/SignUp'
import LogIn from './pages/auth/LogIn'
import Profile from './pages/Profile'
import Error from './pages/Error'
import Private from './components/auth/Private'
import AllUsers from './pages/AllUsers'
import AllEvents from './pages/AllEvents'
import AllProjects from './pages/AllProjects'
import ListEvents from './components/ListEvents'
import DetailsUser from './pages/DetailsUser'
import ListProjects from './components/ListProjects'
import NewProject from './pages/forms/NewProject'
import NewEvent from './pages/forms/NewEvent'
import EditUser from './pages/forms/EditUser'
import DetailsEvent from './pages/DetailsEvent'
import EditProject from './pages/forms/EditProject'
import EditEvent from "./pages/forms/EditEvent"
import DetailsProject from './pages/DetailsProject'
import Footer from './components/Footer'
import CardCategory from './components/CardCategory'
import NotFound from './pages/NotFound'

function App() {

  return (
    <div>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/user/profile" element={<Profile/>}/>
        <Route path="/user/profile/:username" element={<DetailsUser/>}/>
        <Route path="/user" element={<AllUsers/>}/>
        <Route path="/profile/edit" element={<EditUser />} />
        <Route path="/category/:category" element={<CardCategory/>}/>

        {/*Project routes*/}        
        <Route path="/project" element={<AllProjects/>}/>
        <Route path="/newproject" element={<NewProject />} />
        <Route path="/project/:projectid" element={<DetailsProject/>}/>
        <Route path="/editproject/:projectid" element={<EditProject/>} />

        {/*Event routes*/}
        <Route path="/event" element={<AllEvents/>}/>
        <Route path="/event/:eventid" element={<DetailsEvent/>}/>
        <Route path="/newevent" element={<NewEvent />} />
        <Route path="/editevent/:eventid" element={<EditEvent/>}/>

        {/*Error and noutfound */}
        <Route path="/error" element={<Error />}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      
      <Footer/>
    </div>
  )
}

export default App

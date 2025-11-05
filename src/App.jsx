import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from "./components/header"
import {Routes,Route} from 'react-router-dom'
import Homepage from './pages/homepage'
import AboutCongress from './pages/AboutCongress'
import AbstractSubmJuryEva from './pages/abstractSubmissionJuryEva'
import Accomodation from './pages/accommodation'
import ScientificProgram from './pages/scientificProgram'
import Workshops from './pages/workshop'
import SocialProgram from './pages/socialProgram'
import PartnersAndSponsors from './pages/partnersAndSponsors'

import NotFoundPage from './pages/notFoundPage'
import Registraion from './pages/registration'
import AboutUs from './pages/AboutUs'
import OrganizationCommittee from './pages/organizationCommittee'
import AdminPanel from "./components/AdminPanel"
function App() {
  

  return (
    <div>
      <Header/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/AboutCongress' element={<AboutCongress/>}/>
          <Route path='AboutUs' element={<AboutUs/>}/>
          <Route path='organizationCommit'  element={<OrganizationCommittee/>}/>
        <Route/>
        <Route path='/registration' element={<Registraion/>}/>
        <Route path='/abstractSubmJuryEva' element={<AbstractSubmJuryEva/>}/>
        <Route path='/accomodation' element={<Accomodation/>}/>
        <Route path='/scientificProgram' element={<ScientificProgram/>}/>
        <Route path='/workshops' element={<Workshops/>}/>
        <Route path='/socialProgram' element={<SocialProgram/>}/>
        <Route path='/partnersAndSponsors' element={<PartnersAndSponsors/>}/>
        <Route path='/*' element={<NotFoundPage/>}/>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    


    </div>
  )
}

export default App

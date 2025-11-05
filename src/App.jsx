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
import AdminPanel from "/src/components/AdminPanel"

function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/about-congress' element={<AboutCongress/>}/>
        <Route path='/about-us' element={<AboutUs/>}/>
        <Route path='/organization-committee' element={<OrganizationCommittee/>}/>
        <Route path='/registration' element={<Registraion/>}/>
        <Route path='/abstract-submission' element={<AbstractSubmJuryEva/>}/>
        <Route path='/accommodation' element={<Accomodation/>}/>
        <Route path='/scientific-program' element={<ScientificProgram/>}/>
        <Route path='/workshops' element={<Workshops/>}/>
        <Route path='/social-program' element={<SocialProgram/>}/>
        <Route path='/partners-sponsors' element={<PartnersAndSponsors/>}/>
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </div>
  )
}

export default App
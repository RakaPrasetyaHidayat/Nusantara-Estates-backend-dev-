import React from 'react'
import Navbar from '../../Components/navbar/navbar'
import RumahPage from '../../Components/rumah/RumahPage'
import ResultTipe from '../components/ResultTipe' 
import Footer from '../../Components/footer/footer'
import './RumahPage.css'
import './ResultTipe.css'
import './footer..css'
import './navbar.css';

const RumahPage = () => {
  return (
    <div>
        <Navbar />
        <div className="rumah-container">
            <RumahPage />
            <ResultTipe />
        </div>
        <Footer />
    </div>
  )
}

export default RumahPage
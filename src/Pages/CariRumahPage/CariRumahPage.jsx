import React from 'react'
import Navbar from '../../Components/navbar/navbar'
import CarirumahPage from '../../Components/carirumah/CarirumahPage'
import Footer from '../../Components/footer/footer'

const CariRumahPage = () => {
  return (
    <div>
        <Navbar />
        <div className="cari-rumah-container">
            <CarirumahPage />
        </div>
        <Footer />
    </div>
  )
}

export default CariRumahPage
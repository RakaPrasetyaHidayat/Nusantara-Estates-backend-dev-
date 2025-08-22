import React from 'react'
import Navbar from '../../Components/navbar/navbar'
import ContactAgent from '../../Components/contactAgen/contactAgen'
import Footer from '../../Components/footer/footer'

const ContactAgenPage = () => {
  return (
    <div>
        <Navbar />
        <div className="contact-agent-page">
            <ContactAgent />
        </div>
        <Footer />
    </div>
  )
}

export default ContactAgenPage
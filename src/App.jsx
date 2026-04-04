import React from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import About from './components/About'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import TestimonialContact from './components/TestimonialContact'
import AdminHome from './components/Admin/AdminHome'


export default function App() {
  return (
    <div>
      <Navbar/>
      <Header/>
     <section id = "about" className = "scroll-mt-20"> <About/></section>
      <section id = "destinations" className = "scroll-mt-20"> <Destinations/></section>
      <section id = "testimonialsandcontact" className = "scroll-mt-20"> <TestimonialContact/></section>
      
      <Footer/>

      {/* <AdminHome/> */}
    </div>
  )
}


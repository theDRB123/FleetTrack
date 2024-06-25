import React from 'react'
// import Navbar from './Navbar'
import Header from './components/Header'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import './Home.css'
// import LoginBtn from './components/LoginBtn'

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="header-sidebar-container">
        {/* <LoginBtn /> */}
        <SideBar />
        <Header />
      </div>
      <Footer />
    </>
  )
}

export default Home
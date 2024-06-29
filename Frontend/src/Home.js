import React from 'react'
import Navbar from './Navbar'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'


const Home = () => {
  return (
    <>
      {/* <div>
        <h1>Home Page</h1>
      </div> */}
      <Navbar />
      <Header />
      <About />
      <Footer />
    </>
  )
}

export default Home
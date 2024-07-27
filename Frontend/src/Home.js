import React from 'react';
import Navbar from './Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
// import Extras from './components/Extras';
import About from './About';
import Services from './Services';
import ContactUs from './Contact';

const Home = () => {
  return (
    <main style={{position: "relative"}}>
      {/* <div className='nav'> */}
        <Navbar />
      {/* </div> */}
      
      <Header />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      {/* <div id="extras"><Extras /></div> */}
      <div id="contact"><ContactUs /></div>

      <Footer />
    </main>
  );
};

export default Home;
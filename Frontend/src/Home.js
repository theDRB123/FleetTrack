import React from 'react';
import Navbar from './Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import ContactUs from './components/Contact';
import Services from './components/Services';
import Extras from './components/Extras'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="extras"><Extras /></div>
      <div id="contact"><ContactUs /></div>

      {/* <div className="App">
        <Routes>
        <Route path="/extras" element={<Extras />} />
        </Routes>

      </div> */}
      

      <Footer />
    </>
  );
};

export default Home;
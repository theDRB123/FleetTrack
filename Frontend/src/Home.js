import React from 'react';
import Navbar from './Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import ContactUs from './components/Contact';
import Services from './components/Services';

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="contact"><ContactUs /></div>
      <Footer />
    </>
  );
};

export default Home;
import React from 'react';
import Navbar from './Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Extras from './components/Extras'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
<<<<<<< HEAD
      <div id="about"><About /></div>
      <div id="services"><Services /></div>
      <div id="extras"><Extras /></div>
      <div id="contact"><ContactUs /></div>
=======
>>>>>>> e8499eff4396d34619f1fa9327a7e1bb2b5fb55f

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
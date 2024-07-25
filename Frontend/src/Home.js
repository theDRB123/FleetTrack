import React from 'react';
import Navbar from './Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import Extras from './components/Extras'
import { Routes, Route } from 'react-router-dom'; ;

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />

      <div className="App">
        <Header />
        <Routes>
        <Route path="/extras" element={<Extras />} />
        </Routes>

      </div>

      <Footer />
    </>
  );
};

export default Home;
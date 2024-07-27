import React from 'react';
import './Extras.css';
import serviceImg from '../assets/services.png'; 
import RouteOpt from '../assets/about.webp';
import RealTime from '../assets/aboutimg.avif';
import { Route } from 'react-router-dom';


const services = [
  {
    id: 1,
    title: 'Real-Time Tracking',
    description: 'Monitor your fleet in real-time, ensuring you have complete visibility over your vehicles and assets.',
    image: RealTime, 
    imagePosition: 'left',
  },
  {
    id: 2,
    title: 'Route Optimization',
    description: 'Optimize routes to ensure the fastest, most efficient paths are taken, saving time and fuel.',
    image: RouteOpt, 
    imagePosition: 'right',
  },
  {
    id: 3,
    title: 'Vehicle Maintenance',
    description: 'Stay ahead of maintenance needs with predictive alerts, keeping your fleet in top condition.',
    image: serviceImg, 
    imagePosition: 'left',
  },
];

const Extras = () => {

  return (
    <div className="servicesPage">
      {services.map((service) => (
        <div key={service.id} className={`serviceItem ${service.imagePosition === 'left' ? 'imageLeft' : 'imageRight'}`}>
          <img src={service.image} alt={service.title} className="serviceImage" />
          <div className="serviceText">
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Extras;
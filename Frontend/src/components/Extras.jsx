import React from 'react';
import './Extras.css';

const services = [
  {
    id: 1,
    title: 'Real-Time Tracking',
    description: 'Monitor your fleet in real-time, ensuring you have complete visibility over your vehicles and assets.',
    image: '/images/real-time-tracking.jpg',
    imagePosition: 'left',
  },
  {
    id: 2,
    title: 'Route Optimization',
    description: 'Optimize routes to ensure the fastest, most efficient paths are taken, saving time and fuel.',
    image: '/images/route-optimization.jpg',
    imagePosition: 'right',
  },
  {
    id: 3,
    title: 'Vehicle Maintenance',
    description: 'Stay ahead of maintenance needs with predictive alerts, keeping your fleet in top condition.',
    image: '/images/vehicle-maintenance.jpg',
    imagePosition: 'left',
  },
];

const ServicesPage = () => {
  return (
    <div className="servicesPage">
      {services.map((service, index) => (
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
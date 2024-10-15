// components/DestinationCard.js
import React from 'react';

const DestinationCard = ({name, image}) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </div>
  );
};

export default DestinationCard;
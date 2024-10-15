// components/DestinationCard.js
import React from 'react';

const DestinationCard = ({name, image}) => {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden">
      <img src="https://assets.editorial.aetnd.com/uploads/2019/03/topic-london-gettyimages-760251843-feature.jpg?width=1920&height=960&crop=1920%3A960%2Csmart&quality=75&auto=webp" alt={name} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </div>
  );
};

export default DestinationCard;
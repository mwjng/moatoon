import React from 'react';
import BookImg from '../../assets/images/book1.png'

const ParticipatingBookCard = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-32">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={BookImg}
          alt={item.name}
          className="w-full h-40 object-cover"
        />
      </div>
      <p className="mt-2 text-sm text-gray-800 text-center truncate">
        {item.name}
      </p>
    </div>
  );
};

export default ParticipatingBookCard;
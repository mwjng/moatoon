import React from 'react';

const StoryTag = ({ label, value }) => {
  return (
    <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
      {label}: {value}
    </span>
  );
};

export default StoryTag;
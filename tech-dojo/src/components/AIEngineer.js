import React, { useState } from 'react';
import AIEngineerWorkspace from './AIEngineerWorkspace';

const AIEngineer = () => {
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  
  const renderContent = () => {
    switch(selectedLevel) {
      case 'intermediate':
        return <AIEngineerWorkspace />;
      case 'beginner':
        return <div className="p-8">Beginner content coming soon</div>;
      case 'advanced':
        return <div className="p-8">Advanced content coming soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4">
        <div 
          className={`p-2 cursor-pointer rounded mb-2 ${
            selectedLevel === 'beginner' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelectedLevel('beginner')}
        >
          Beginner
        </div>
        <div 
          className={`p-2 cursor-pointer rounded mb-2 ${
            selectedLevel === 'intermediate' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelectedLevel('intermediate')}
        >
          Intermediate
        </div>
        <div 
          className={`p-2 cursor-pointer rounded ${
            selectedLevel === 'advanced' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => setSelectedLevel('advanced')}
        >
          Advanced
        </div>
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default AIEngineer;
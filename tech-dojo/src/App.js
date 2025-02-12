import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

// Navbar Component
const Navbar = () => {
  const paths = ['AI Engineer', 'Data Scientist', 'Software Engineer'];
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Tech Dojo</div>
        <div className="flex space-x-6">
          {paths.map((path) => (
            <Link
              key={path}
              to={`/${path.toLowerCase().replace(' ', '-')}`}
              className={`hover:text-gray-300 ${
                location.pathname.includes(path.toLowerCase().replace(' ', '-'))
                  ? 'text-blue-400'
                  : ''
              }`}
            >
              {path}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Sidebar Component
const Sidebar = ({ onLevelSelect, selectedLevel }) => {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  
  return (
    <div className="bg-gray-100 w-64 min-h-screen p-4">
      <div className="space-y-4">
        {levels.map((level) => (
          <div
            key={level}
            onClick={() => onLevelSelect(level.toLowerCase())}
            className={`cursor-pointer p-2 rounded ${
              selectedLevel === level.toLowerCase()
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200'
            }`}
          >
            {level}
          </div>
        ))}
      </div>
    </div>
  );
};

// Content Components for each path
const AIEngineer = () => {
  const [selectedLevel, setSelectedLevel] = useState('intermediate');

  const AIEngineerWorkspace = React.lazy(() => import('./components/AIEngineerWorkspace'));

  return (
    <div className="flex">
      <Sidebar onLevelSelect={setSelectedLevel} selectedLevel={selectedLevel} />
      <div className="flex-1">
        {selectedLevel === 'intermediate' && (
          <React.Suspense fallback={<div>Loading...</div>}>
            <AIEngineerWorkspace />
          </React.Suspense>
        )}
        {selectedLevel !== 'intermediate' && (
          <div className="p-8">
            <h2 className="text-2xl font-bold">
              AI Engineer - {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Path
            </h2>
            <p>Content coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DataScientist = () => (
  <div className="flex">
    <Sidebar onLevelSelect={() => {}} selectedLevel="" />
    <div className="p-8">
      <h2 className="text-2xl font-bold">Data Scientist Path</h2>
    </div>
  </div>
);

const SoftwareEngineer = () => (
  <div className="flex">
    <Sidebar onLevelSelect={() => {}} selectedLevel="" />
    <div className="p-8">
      <h2 className="text-2xl font-bold">Software Engineer Path</h2>
    </div>
  </div>
);

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<AIEngineer />} />
          <Route path="/ai-engineer" element={<AIEngineer />} />
          <Route path="/data-scientist" element={<DataScientist />} />
          <Route path="/software-engineer" element={<SoftwareEngineer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
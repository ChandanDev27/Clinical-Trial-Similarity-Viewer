import React from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const ViewToggle = ({ viewMode, onViewChange }) => {
  const navigate = useNavigate();

  const handleViewChange = (newView) => {
    console.log(`Switching to ${newView} view`);
    onViewChange(newView); // Update the view mode in local state
    // Navigate to the route corresponding to the new view
    navigate(newView === 'list' ? '/listview' : '/dashboard');
  };

  return (
    <div className="flex gap-4 mb-6">
      <Button 
        variant={viewMode === 'list' ? 'primary' : 'secondary'}
        animate={true}
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        onClick={() => handleViewChange('list')}
      >
        <img 
          src="/images/img_tablerlayoutlist.svg" 
          alt="List view" 
          className="w-5 h-5" 
        />
        <span className="text-xs">List view</span>
      </Button>
      
      <Button 
        variant={viewMode === 'dashboard' ? 'primary' : 'secondary'}
        animate={true}
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        onClick={() => handleViewChange('dashboard')}
      >
        <img 
          src="/images/img_hugeicon.svg" 
          alt="Dashboard view" 
          className="w-5 h-5" 
        />
        <span className="text-xs">Dashboard view</span>
      </Button>
    </div>
  );
};

ViewToggle.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default ViewToggle;

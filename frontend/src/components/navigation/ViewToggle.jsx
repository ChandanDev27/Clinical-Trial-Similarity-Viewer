import React from 'react';
import PropTypes from 'prop-types';

const ViewToggle = ({ viewMode, onViewChange }) => (
  <div className="flex gap-4 mb-6">
    <button 
      className={`flex items-center px-3 py-2 rounded-lg border ${viewMode === 'list' ? 'border-[#652995] text-[#652995] font-semibold' : 'border-[#e9eaef] text-[#232323] font-medium'}`}
      onClick={() => onViewChange('list')}
    >
      <img src="/images/img_tablerlayoutlist.svg" alt="List view" className="w-5 h-5 mr-2" />
      <span className="text-xs">List view</span>
    </button>
    
    <button 
      className={`flex items-center px-3 py-2 rounded-lg border ${viewMode === 'dashboard' ? 'border-[#652995] text-[#652995] font-semibold' : 'border-[#e9eaef] text-[#232323] font-medium'}`}
      onClick={() => onViewChange('dashboard')}
    >
      <img src="/images/img_hugeicon.svg" alt="Dashboard view" className="w-5 h-5 mr-2" />
      <span className="text-xs">Dashboard view</span>
    </button>
  </div>
);

ViewToggle.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired
};

export default ViewToggle;

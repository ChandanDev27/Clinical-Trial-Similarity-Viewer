import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ apiEndpoint, activeTab, onChange, className = '', ...props }) => {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error('Failed to fetch tabs');
        const data = await response.json();

        setTabs(data.map(tab => ({
          id: tab.id || tab.value, // Ensure unique ID
          label: tab.label || tab.name, // Adjust label format
          icon: tab.icon || null, // Handle icon if available
        })));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTabs();
  }, [apiEndpoint]);

  if (loading) return <p>Loading tabs...</p>;
  if (error) return <p>Error loading tabs: {error}</p>;

  return (
    <div className={`flex ${className}`} {...props}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center px-3 py-2 rounded-lg border text-sm ${
            activeTab === tab.id
              ? 'border-[#652995] text-[#652995] font-semibold'
              : 'border-[#e9eaef] text-[#232323] font-medium hover:bg-[#f7f7f7]'
          }`}
        >
          {tab.icon && <img src={tab.icon} alt={tab.label} className="w-5 h-5 mr-2" />}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  apiEndpoint: PropTypes.string.isRequired, // API URL for fetching tabs
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Tabs;

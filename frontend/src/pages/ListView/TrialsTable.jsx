import React from 'react';
import PropTypes from 'prop-types';
import sponsorLogos from '../../sponsorLogos';

const TrialsTable = ({ trials, selectedTrials, onTrialSelect, onSelectAll }) => {
  const isAllSelected = trials.length > 0 && selectedTrials.length === trials.length;

  return (
    <div className="overflow-x-auto border border-[#e9eaef] rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-white">
            <th className="w-12 p-4">
              <div className="flex justify-center">
                <div 
                className={`w-[16px] h-[16px] rounded-sm flex items-center justify-center cursor-pointer ${
                  isAllSelected ? 'bg-[#652995]' : 'border border-[#e9eaef]'
                }`}
                onClick={() => onSelectAll(!isAllSelected)}
              >
                {isAllSelected && (
                  <img src="/images/img_vector.svg" alt="Selected" className="w-2 h-2" />
                )}
              </div>
           </div>
          </th>
            <th className="p-4 text-left w-[209.2px] h-[56px] relative">
              <div className="flex items-center">
                <img src="/images/img_iconly_light_folder.svg" alt="Folder" className="w-5 h-5" />
                <span className="text-sm font-semibold text-[#232323] ml-2">NCT ID</span> 
                <div className="absolute right-[8px] inset-y-0 flex items-center">
                  <img src="/images/img_formatlinespacingstreamlinesharpmaterialsymbols.svg" alt="Sort" className="w-4 h-4" />
                </div>
                </div>
              <div className="border-r border-[#6d719419] h-full absolute right-0 top-0"></div>
            </th>
            
            <th className="p-4 text-left w-[491.2px] h-[56px] relative">
              <div className="flex items-center">
                <img src="/images/img_iconly_light_folder.svg" alt="Folder" className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold text-[#232323] ml-2">Locations</span>
                <div className="absolute right-[8px] inset-y-0 flex items-center">
                  <img src="/images/img_formatlinespacingstreamlinesharpmaterialsymbols.svg" alt="Sort" className="w-4 h-4" />
                </div>
                </div>
              <div className="border-r border-[#6d719419] h-full absolute right-0 top-0"></div>
            </th>

            <th className="p-4 text-left w-[200px] h-[56px] relative">
              <div className="flex items-center">
                <img src="/images/img_folderdollarstreamlinetabler.svg" alt="Folder" className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold text-[#232323]">Enrollment Count</span>
                <div className="absolute right-[8px] inset-y-0 flex items-center">
                  <img src="/images/img_formatlinespacingstreamlinesharpmaterialsymbols.svg" alt="Sort" className="w-4 h-4" />
                </div>
                </div>
              <div className="border-r border-[#6d719419] h-full absolute right-0 top-0"></div>
            </th>
            <th className="p-4 text-left w-[160px] h-[56px] relative">
              <div className="flex items-center">
                <img src="/images/img_hugeicon_20x20.svg" alt="Phase" className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold text-[#232323]">Phase</span>
                <div className="absolute right-[8px] inset-y-0 flex items-center">
                  <img src="/images/img_formatlinespacingstreamlinesharpmaterialsymbols.svg" alt="Sort" className="w-4 h-4" />
                </div>
              </div>
              <div className="border-r border-[#6d719419] h-full absolute right-0 top-0"></div>
            </th>
            <th className="p-4 text-left w-[200px] h-[56px] relative">
              <div className="flex items-center">
                <img src="/images/img_mageusers.svg" alt="Users" className="w-5 h-5 mr-2" />
                <span className="text-sm font-semibold text-[#232323]">Sponsor</span>
                <div className="absolute right-[8px] inset-y-0 flex items-center">
                  <img src="/images/img_formatlinespacingstreamlinesharpmaterialsymbols.svg" alt="Sort" className="w-4 h-4" />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {trials.map((trial) => (
            <tr key={trial.nctId} className="bg-[#f4f5fa]">
              <td className="p-4">  
                <div className="flex justify-center">
                  <div 
                    className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${selectedTrials.includes(trial.nctId) ? 'bg-[#652995]' : 'border border-[#e9eaef]'}`}
                    onClick={() => onTrialSelect(trial.nctId)}
                  >
                    {selectedTrials.includes(trial.nctId) && (
                      <img src="/images/img_vector.svg" alt="Selected" className="w-2 h-2" />
                    )}
                  </div>
                </div>
              </td>
             <td className="p-4 text-sm text-[#232323]">{trial.nctId}</td>
             <td className="p-4 text-sm text-[#232323]">
                {trial.locations?.join(', ') || 'N/A'}
             </td>
             <td className="p-4 text-sm text-[#232323]">
                {trial.enrollmentCount || 'N/A'}
             </td>
             <td className="p-4 text-sm text-[#232323]">
                {trial.phases?.join(', ') || 'N/A'}
             </td>
             <td className="flex items-center gap-2 p-4">
                {sponsorLogos[trial.sponsorType] ? (
                <img 
                  src={sponsorLogos[trial.sponsorType]} 
                  alt={trial.sponsorType}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">
                    {trial.sponsorType.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm text-[#232323]">
                {trial.sponsorType}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};
          
TrialsTable.propTypes = {
  trials: PropTypes.arrayOf(
    PropTypes.shape({
      nctId: PropTypes.string.isRequired,
      locations: PropTypes.arrayOf(PropTypes.string).isRequired,
      enrollmentCount: PropTypes.number.isRequired,
      phases: PropTypes.arrayOf(PropTypes.string).isRequired,
      sponsorType: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedTrials: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTrialSelect: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
};

export default TrialsTable;

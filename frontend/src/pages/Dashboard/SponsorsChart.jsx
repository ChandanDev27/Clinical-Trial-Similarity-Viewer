import React from "react";
import Card from "../../components/ui/Card";
import sponsorLogos from "../../sponsorLogos";

const SponsorsChart = ({ data = [] }) => {
  const calculateBarWidth = (count, maxCount) => {
    const maxBarWidth = 180;
    return maxCount > 0 ? (count / maxCount) * maxBarWidth : 0;
  };

  const getSponsorLogo = (name) => {
    if (!name || name === "Unknown Sponsor") return sponsorLogos.default;
    return sponsorLogos[name] || sponsorLogos.default;
  };

  const validSponsors = data.filter(s => s.name && s.name !== "Unknown Sponsor");
  const maxCount = validSponsors.length > 0 
    ? Math.max(...validSponsors.map(s => s.count))
    : 1;

  return (
    <Card className="h-full p-4">
      <h2 className="text-base font-medium text-[#6d7194] mb-4 text-left">Sponsors</h2>

      <div className="flex flex-row items-center gap-3 mb-[30px]">
        <div className="w-2 h-2 rounded-full bg-[#652995]"></div>
        <span className="text-[11px] font-Inter font-normal leading-[100%] tracking-[0%] text-[#6d7194]">
          Count
        </span>
      </div>

      <div className="flex flex-col space-y-10 w-[325px] h-[370px]">
        {validSponsors.length > 0 ? (
          validSponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <img
                  src={getSponsorLogo(sponsor.name)}
                  alt=""
                  className="w-8 h-8 object-contain mr-3"
                  onError={(e) => {
                    e.target.src = sponsorLogos.default;
                  }}
                />
              </div>
              
              <div className="flex items-center">
                <div className="w-[180px] relative h-3 bg-gray-200 rounded-md mr-3">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#652995] rounded-md"
                    style={{ width: `${calculateBarWidth(sponsor.count, maxCount)}px` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-[#6d7194] min-w-[30px] text-right">
                  {sponsor.count}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#6d7194]">No sponsor data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SponsorsChart;
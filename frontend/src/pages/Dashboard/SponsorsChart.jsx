import React, { useMemo } from "react";
import Card from "../../components/ui/Card";
import sponsorLogos from "../../sponsorLogos";

const SponsorsChart = ({ trials, selectedTrials }) => {
  // Process sponsors efficiently using useMemo
  const sponsorsData = useMemo(() => {
    const sponsorsMap = new Map();

    // Filter trials based on selection
    const relevantTrials = selectedTrials?.length
      ? trials.filter((trial) => selectedTrials.includes(trial.nctId))
      : trials;

    relevantTrials.forEach((trial) => {
      const sponsorName = trial.sponsor?.trim() || "Unknown Sponsor";
      sponsorsMap.set(sponsorName, (sponsorsMap.get(sponsorName) || 0) + 1);
    });

    return Array.from(sponsorsMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        logo: sponsorLogos[name] || sponsorLogos["default"], // Ensure fallback logo
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Show top 4 sponsors
  }, [trials, selectedTrials]);

  // Dynamically calculate max count for proportional bar width
  const maxCount = Math.max(...sponsorsData.map((s) => s.count), 1);

  const calculateBarWidth = (count) => {
    const maxBarWidth = 180; // Adjusted bar width to fit within 360px
    return (count / maxCount) * maxBarWidth;
  };

  return (
    <Card className="border border-gray-300 rounded-lg overflow-hidden max-w-[360px] max-h-[400px] w-[360px] h-[400px] p-[16px]">
      <h2 className="text-base font-medium text-[#6d7194] mb-4 text-left">Sponsors</h2>

      <div className="flex flex-row items-center gap-3 mb-[30px]">
        <div className="w-2 h-2 rounded-full bg-[#652995]"></div>
        <span className="text-[11px] font-Inter font-normal leading-[100%] tracking-[0%] text-[#6d7194]">
          Count
        </span>
      </div>

      <div className="flex flex-col space-y-10 w-[325px] h-[370px]">
        {sponsorsData.map((sponsor) => (
          <div key={sponsor.name} className="flex items-center justify-between w-full">
            <img
              src={sponsorLogos[sponsor.name] || sponsorLogos["default"]}
              alt={sponsor.name || "Unknown Sponsor"}
              className="w-8 h-8 object-contain mr-2"
              onError={(e) => {
                e.target.src = sponsorLogos["default"];
                e.target.alt = "Unknown Sponsor";
              }}
            />
            <div className="flex-1 relative h-3 bg-gray-200 rounded-md">
              <div
                className="absolute left-0 top-0 h-full bg-[#652995] rounded-md"
                style={{ width: `${calculateBarWidth(sponsor.count)}px` }}
              ></div>
            </div>
            {/* Added spacing between graph and total count */}
            <span className="text-sm font-medium text-[#6d7194] min-w-[30px] text-right">
              {sponsor.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SponsorsChart;

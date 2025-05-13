import { useState, useEffect } from "react";
import mapImages from "../../mapImages";
import Card from "../../components/ui/Card";

const convertToPixel = (lat, lng, mapWidth, mapHeight) => {
  const x = ((lng + 180) / 360) * mapWidth; // Convert longitude to X coordinate
  const y = ((90 - lat) / 180) * mapHeight; // Convert latitude to Y coordinate
  return { x, y };
};

const RegionalDistributionMap = ({ trialData }) => {
  const [data, setData] = useState(trialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((trial) =>
          trial.value > 0 ? { ...trial, value: Math.floor(Math.random() * 100) } : trial
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-5 w-[432px] h-[337px] gap-[10px] rounded-[12px] border border-[1px] relative">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Region</h2>
  
      {/* Map Container with Fixed Size */}
      <div className="relative w-[392px] h-[209.472px] overflow-hidden">
        <img 
          src={mapImages.world} // Dynamically loads the world map image
          alt="World Map" 
          className="w-full h-full object-cover rounded-[12px] border border-[1px]" 
        />

        {/* Dynamically Appearing & Animating Dots */}
        {data
          .filter((trial) => trial.latitude && trial.longitude) // Ensure valid coordinates
          .map((trial, index) => {
            const { x, y } = convertToPixel(trial.latitude, trial.longitude, 392, 209.472); // Adjust map dimensions
            return (
              <div
                key={index}
                className={`absolute w-3 h-3 rounded-full transition-all duration-1000 ease-in-out transform scale-75 opacity-0 animate-fadeIn 
                ${trial.status === "active" ? "animate-pulse" : ""}`}
                style={{
                  top: `${y}px`, // Correct Y positioning
                  left: `${x}px`, // Correct X positioning
                  backgroundColor: trial.status === "active" ? "#38e0ae" : "#f4f5fa",
                  opacity: 1,
                  transform: "scale(1)",
                }}
              ></div>
            );
          })}
      </div>

      {/* Minimal Labels */}
      <div className="flex items-center mt-4">
        <div className="flex items-center mr-8">
          <div className="w-3 h-3 rounded-full bg-[#38e0ae] mr-2 animate-pulse"></div>
          <span className="text-xs text-[#a5a7b1]">Active Trials</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#f4f5fa] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Completed Trials</span>
        </div>
      </div>
    </Card>
  );
};

export default RegionalDistributionMap;

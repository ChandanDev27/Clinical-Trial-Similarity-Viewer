import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "../../components/ui/Card";
import { getCountryCoordinates } from "../../utils/countryCoordinates";

const customTrialIcon = new L.divIcon({
  className: "trial-marker",
  html: `<div class="custom-marker"></div>`,
  iconSize: [20, 20],
  popupAnchor: [0, -10],
});

const RegionalDistributionMap = ({ trials = [] }) => {
  const mapData = useMemo(() => {
    if (!trials || !Array.isArray(trials)) return [];

    const countryCounts = {};
    trials.forEach((trial) => {
      trial.locations?.forEach((location) => {
        countryCounts[location] = (countryCounts[location] || 0) + 1;
      });
    });

    return Object.entries(countryCounts)
      .map(([country, count]) => ({
        country,
        count,
        coordinates: getCountryCoordinates(country),
      }))
      .filter((item) => item.coordinates);
  }, [trials]);

  return (
    <Card className="w-full max-w-[380px] min-w-[320px] max-h-[300px]">
      <h2 className="text-base font-medium text-[#6d7194] mb-2">Trials by Region</h2>

      <div className="flex flex-wrap gap-x-8 mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#38E0AE] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Trials</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#F4F5FA] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">--</span>
        </div>
      </div>

      <div className="w-full max-w-[380px] h-[210px] rounded-[10px] border overflow-hidden flex justify-center">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {mapData.map((item, index) => (
            <Marker key={index} position={[item.coordinates.lat, item.coordinates.lng]} icon={customTrialIcon}>
              <Popup>
                <div style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 500 }}>
                  {item.country}: {item.count} trial(s)
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default RegionalDistributionMap;

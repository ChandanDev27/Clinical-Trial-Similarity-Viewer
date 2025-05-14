import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "../../components/ui/Card";

const customTrialIcon = new L.divIcon({
  className: "trial-marker",
  html: `<div class="custom-marker"></div>`,
  iconSize: [20, 20],
  popupAnchor: [0, -10],
});

const RegionalDistributionMap = ({ data = [] }) => {
  return (
    <Card className="h-full flex flex-col">
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

      <div className="flex-grow rounded-[10px] border overflow-hidden">
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
          {data.map((item, index) => (
            <Marker 
              key={index} 
              position={[item.coordinates.lat, item.coordinates.lng]} 
              icon={customTrialIcon}
            >
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

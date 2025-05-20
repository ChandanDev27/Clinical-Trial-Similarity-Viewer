import React from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "../../components/ui/Card";
import { 
  selectMapData,
  selectTrialsLoading 
} from "../../features/trials/trialsSlice"

const RegionalDistributionMap = () => {
  const mapData = useSelector(selectMapData);
  const isLoading = useSelector(selectTrialsLoading);

  const customTrialIcon = new L.divIcon({
    className: "trial-marker",
    html: `<div class="custom-marker" aria-label="Trial location"></div>`,
    iconSize: [20, 20],
    popupAnchor: [0, -10],
  });

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <h2 className="text-base font-medium text-[#6d7194] mb-2">Trials by Region</h2>
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 h-full w-full rounded-[10px]"></div>
        </div>
      </Card>
    );
  }

  if (!mapData.length) {
    return (
      <Card className="h-full flex flex-col">
        <h2 className="text-base font-medium text-[#6d7194] mb-2">
          Trials by Region
        </h2>
        <div className="flex-grow flex items-center justify-center text-gray-400">
          No location data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-base font-medium text-[#6d7194] mb-2">
        Trials by Region
      </h2>

      <div className="flex flex-wrap gap-x-8 mb-3">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#38E0AE] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Trials</span>
        </div>
      </div>

      <div className="flex-grow rounded-[10px] border overflow-hidden">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: "100%", width: "100%" }}
          aria-label="Clinical trials world map"
          minZoom={2}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={40}
            spiderfyDistanceMultiplier={2}
          >
            {mapData.map((item, index) => {
              if (!item.coordinates) return null;
    
              return (
                <Marker 
                  key={`${item.country}-${index}`}
                  position={[item.coordinates.lat, item.coordinates.lng]}
                  icon={customTrialIcon}
                >
                  <Popup>
                    <div className="text-sm font-medium">
                      <p className="font-semibold">{item.country}</p>
                      <p>{item.count} trial(s)</p>
                      <p className="text-xs text-gray-500">{item.region} region</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </Card>
  );
};

export default RegionalDistributionMap;
          
import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Card from "../../components/ui/Card";
import { getCountryCoordinates } from "../../utils/countryCoordinates";

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
    <Card className="p-5">
      <h2
        style={{
          fontFamily: "Inter",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "100%",
          letterSpacing: "0%",
          marginTop: "20px",
        }}
      >
        Trials by Region
      </h2>

      {/* Leaflet Map */}
      <MapContainer center={[20, 0]} zoom={2} className="w-full h-[400px] rounded-[12px]">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {mapData.map((item, index) => (
          <Marker key={index} position={[item.coordinates.lat, item.coordinates.lng]}>
            <Popup>
              <div style={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 500 }}>
                {item.country}: {item.count} trial(s)
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Card>
  );
};

export default RegionalDistributionMap;

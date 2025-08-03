"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";
import L from "leaflet";

// Fix Leaflet marker icon path issue
import "leaflet/dist/leaflet.css";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = () => {
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  const coordinates = filters.coordinates || [-74.5, 40]; // Default fallback

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl h-full">
      <MapContainer
        center={[coordinates[1], coordinates[0]]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[
              property.location.coordinates.latitude,
              property.location.coordinates.longitude,
            ]}
          >
            <Popup>
              <div className="marker-popup">
                <div className="marker-popup-image"></div>
                <div>
                  <a
                    href={`/search/${property.id}`}
                    target="_blank"
                    className="marker-popup-title"
                  >
                    {property.name}
                  </a>
                  <p className="marker-popup-price">
                    ${property.pricePerMonth}
                    <span className="marker-popup-price-unit"> / month</span>
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;

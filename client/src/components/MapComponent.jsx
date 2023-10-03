// MapComponent.js

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ center, zoom, locations }) => {
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(link);
    }, []);

    const renderMarkers = () => {
        return locations.forEach((item) => {
            const { cityName, latitude, longitude } = item;

            if (latitude && longitude) {
                return (
                    <Marker key={`${latitude}-${longitude}`} position={[latitude, longitude]}>
                        <Popup>{cityName}</Popup>
                    </Marker>
                );
            } else {
                return null;
            }
        });
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
            />
            {renderMarkers()}
        </MapContainer>
    );
};

export default MapComponent;

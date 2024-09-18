"use client"

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;


const MapPointSelector = ({setLocation, selectedLocation}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-79.34);
  const [lat, setLat] = useState(43.65);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('click', (e) => {
      const lngLat = e.lngLat.wrap()
      const locationJson = {
        "type": "Point",
        "coordinates": [lngLat.lng,lngLat.lat]
      }
      console.log({locationJson})
      return setLocation(locationJson)
    });
  });

  return (
    <div id="location">
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
    </div>
  );
};

export default MapPointSelector;

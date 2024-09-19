"use client"

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;


const MapPointSelector = ({setLocation, selectedLocation}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-79.34);
  const [lat, setLat] = useState(43.65);
  const [zoom, setZoom] = useState(9);
  let marker;

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

      // remove marker if there is already one on the map
      if (marker !== undefined) {
        marker.remove()
      }

      // add marker to map
      marker = new mapboxgl.Marker({ color: "#223659"}).setLngLat(lngLat).addTo(map.current)

      // convert to point data for backend
      const locationJson = {
        "type": "Point",
        "coordinates": [lngLat.lng,lngLat.lat]
      }

      setLocation(locationJson)
    });
  });

  return (
    <div id="location">
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
    </div>
  );
};

export default MapPointSelector;

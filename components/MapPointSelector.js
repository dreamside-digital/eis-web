"use client"

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;


const MapPointSelector = ({setLocation, selectedLocation}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerDiv = useRef(null);
  const [lng, setLng] = useState(-79.34);
  const [lat, setLat] = useState(43.65);
  const [zoom, setZoom] = useState(9);
  let marker;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      maxZoom: 15
    });

    map.current.on('click', (e) => {
      const lngLat = e.lngLat.wrap()

      // remove marker if there is already one on the map
      if (marker !== undefined) {
        marker.remove()
      }

      // add marker to map
      const el = markerDiv.current
      el.className = 'marker';
      el.style.backgroundImage = "url('/map-icon.svg')";
      el.style.width = `40px`;
      el.style.height = `40px`;
      el.style.backgroundSize = 'cover';
      el.style.cursor = "pointer";

      marker = new mapboxgl.Marker(el).setLngLat(lngLat).addTo(map.current)

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
      <div ref={markerDiv} />
    </div>
  );
};

export default MapPointSelector;

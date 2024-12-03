"use client"

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;


const MapPointSelector = ({markerLocation}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerDiv = useRef(null);
  const [lng, setLng] = useState(-76.17);
  const [lat, setLat] = useState(44.478);
  const [zoom, setZoom] = useState(6);
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

  });

  useEffect(() => {
    if (markerLocation) {
      if (marker !== undefined) {
        marker.remove()
      }

      // add marker to map
      const el = markerDiv.current
      el.className = 'marker';
      el.style.backgroundImage = "url('/map-icon.png')";
      el.style.width = `40px`;
      el.style.height = `40px`;
      el.style.backgroundSize = 'cover';
      el.style.cursor = "pointer";

      console.log("coords", markerLocation.coordinates)
      marker = new mapboxgl.Marker(el).setLngLat(markerLocation.coordinates).addTo(map.current)
      map.current.setCenter(markerLocation.coordinates);
      map.current.zoomTo(15)
    }

  }, [markerLocation])


  return (
    <div id="location">
      <div ref={mapContainer} className="map-container" style={{ height: '400px' }} />
      <div ref={markerDiv} />
    </div>
  );
};

export default MapPointSelector;

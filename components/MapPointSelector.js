"use client"

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTranslations } from 'next-intl';
import { MapPinIcon } from '@heroicons/react/24/solid';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapPointSelector = ({setLocation, selectedLocation}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerDiv = useRef(null);
  const t = useTranslations('profile_form');
  const [lng, setLng] = useState(-76.17);
  const [lat, setLat] = useState(44.478);
  const [zoom, setZoom] = useState(6);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  let marker;

  const setMarkerLocation = (lng, lat) => {
    // remove marker if there is already one on the map
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

    marker = new mapboxgl.Marker(el).setLngLat({lng, lat}).addTo(map.current)

    // convert to point data for backend
    const locationJson = {
      "type": "Point",
      "coordinates": [lng,lat]
    }

    setLocation(locationJson)
  }

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
      setMarkerLocation(lngLat.lng, lngLat.lat)
    });
  })

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = [position.coords.longitude, position.coords.latitude];
          
          // Pan and zoom to the location
          map.current.flyTo({
            center: coordinates,
            zoom: 15,
            essential: true
          });

          // Update marker
          setMarkerLocation(coordinates[0], coordinates[1]);
          setGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(t('location_error'));
          setGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError(t('geolocation_not_supported'));
      setGettingLocation(false);
    }
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="map-container w-full h-[300px] rounded-lg mb-2" />
      <div ref={markerDiv} />
      <button
        type="button"
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        className="btn bg-white text-dark flex items-center gap-1 absolute top-2 right-2 shadow-md"
      >
        <MapPinIcon className="w-4 h-4" />
        {gettingLocation ? t('getting_location') : t('use_my_location')}
      </button>
      {locationError && (
        <p className="text-red-500 text-sm mt-1">{locationError}</p>
      )}
    </div>
  );
};

export default MapPointSelector;

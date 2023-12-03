"use client"

import { useMemo, useState, useRef, useCallback, useEffect} from "react";
import Map, {Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapPin from './_map-components/map-pin';
import LocationGraph from "./_map-components/location-graph";
import LOCATIONS from "map-data/locations.json";
import type {MapRef} from 'react-map-gl';
import HeatmapPing from "./_map-components/heatmap-ping";

// TODO: put interface definitions somewhere else?
interface LatestDensityData {
  density: {
    [id: string]: number
  },
  current_hour: number
}

export default function MapViewer({token, apiKey} : {token: string | undefined, apiKey: string}){

  type LocationType = {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
  };
  
  const [popupInfo, setPopupInfo] = useState<LocationType | null>(null);
  const [latestData, setLatestData] = useState<LatestDensityData>();
  const [currentHour, setCurrentHour] = useState<Number>(new Date().getHours());
  const [heatmapPings, setHeatmapPings] = useState<JSX.Element[]>([]);
  const [heatmapPins, setHeatmapPins] = useState<JSX.Element[]>([]);
  const mapRef = useRef() as React.MutableRefObject<MapRef>;
  const [averageDensityData, setAverageDensityData] = useState<LatestDensityData>();

useEffect(() => {
  const interval = setInterval(async function() {
    const resAvg = await fetch('https://api.uwmap.live/get-average-density-transposed/', {headers: {'x-api-key': apiKey}})
    const resJson: LatestDensityData = await resAvg.json();
    setAverageDensityData(resJson);

    const res = await fetch('https://api.uwmap.live/get-latest-density/', {headers: {'x-api-key': apiKey}});
    const latestData: LatestDensityData = await res.json();
    setLatestData(latestData);
  }, 5000);
  return () => clearInterval(interval);
}, [])

useEffect(() => {
  if (latestData?.density && averageDensityData?.density) {
    const updatedPings: JSX.Element[] = [];
    const updatedPins: JSX.Element[] = [];
    
    setHeatmapPings([]);
    setHeatmapPins([]);
  
    LOCATIONS.forEach(location => {
      updatedPings.push(
        <Marker
        key={`ping-${location.id}`}
        longitude={location.longitude}
        latitude={location.latitude}
        anchor="center"
        style={{position: "absolute", zIndex: -100}}
      >
        <HeatmapPing
            density={(latestData.density[location.id] ?? 0)}
            averageDensity={(averageDensityData.density[location.id][currentHour] ?? 0)}
            zoom={zoom}
        />
      </Marker>
      )
    })

    LOCATIONS.forEach(location => {
      updatedPings.push(
          <Marker
            key={`pin-marker-${location.id}`}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              if (mapRef.current) {
                mapRef.current.flyTo({
                  center: [location.longitude, location.latitude - 0.0004],
                  duration: 1000,
                  zoom : 17,
                  essential: true
                });
              }
              setPopupInfo(location);
            }}
          >
          <MapPin density={(latestData.density[location.id] ?? 0)} averageDensity={(averageDensityData.density[location.id][currentHour] ?? 0)} />
          </Marker>
        )
    })
    
    setHeatmapPings(updatedPings);
    setHeatmapPins(updatedPins);
  }

}, [latestData])

  const [zoom, setZoom] = useState(15.5);

  const onZoom = useCallback(() => {
    const zoom = mapRef.current?.getZoom();
    if (zoom) {
      setZoom(zoom);
    }
  }, []);

  const defaultLongitude = -80.5424;
  const defaultLatitude = 43.4705;
  const distanceOut = 0.02;
  const bounds: [number, number, number, number] = [defaultLongitude - distanceOut, defaultLatitude - distanceOut, defaultLongitude + distanceOut, defaultLatitude + distanceOut];

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{
        longitude: -80.5424, 
        latitude: 43.4705,
        zoom: 15.5, 
      }}
      maxBounds={bounds}
      doubleClickZoom={false}
      onZoom={onZoom}
      mapStyle="mapbox://styles/alexstarosta/clp71tw2j012301qqbc7i101p"
    > 

      {heatmapPings}

      {heatmapPins}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
        >
          <LocationGraph
            id={popupInfo.id}
            locationName={popupInfo.location}
            apiKey={apiKey}
            currentDensity={latestData?.density[popupInfo.id] ?? 0} 
          />
        </Popup>
      )}

    </Map>
  );
}
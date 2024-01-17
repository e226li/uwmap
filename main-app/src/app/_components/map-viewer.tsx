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

interface AverageDensityData {
  density: {
    [id: string]: {
      [id: string]: number
    }
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
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  const [heatmapPings, setHeatmapPings] = useState<JSX.Element[]>([]);
  const [heatmapPins, setHeatmapPins] = useState<JSX.Element[]>([]);
  const mapRef = useRef<MapRef>();
  const [averageDensityData, setAverageDensityData] = useState<AverageDensityData>();

useEffect(() => {
    async function fetchData(fast = false) {
        let avgParams;
        if (fast) {
            avgParams = 'fast=true';
        } else {
            avgParams = 'fast=false';
        }
        const resAvg = await fetch('https://api.uwmap.live/get-average-density-transposed/?' + avgParams, {headers: {'x-api-key': apiKey}})
        const resJson: AverageDensityData = await resAvg.json();
        setAverageDensityData(resJson);
    
        const res = await fetch('https://api.uwmap.live/get-latest-density/', {headers: {'x-api-key': apiKey}});
        const latestData: LatestDensityData = await res.json();
        setLatestData(latestData);
    }

    // run immediately to make pins load immediately on load
    fetchData(true)
        .catch(e => console.log(e));
    const interval = setInterval(() => fetchData(), 5000);
    
    return () => clearInterval(interval);
}, [])

useEffect(() => {
  if (latestData?.density && averageDensityData?.density) {
    const updatedPings: JSX.Element[] = [];
    const updatedPins: JSX.Element[] = [];
    
    setHeatmapPings([]);
    setHeatmapPins([]);
  
    LOCATIONS.forEach(location => {
      // account for null data
      let currentHourDensity = 0;
      if (averageDensityData.density[location.id]) {
        currentHourDensity = averageDensityData.density[location.id]![currentHour] ?? 0;
      }
      
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
            averageDensity={currentHourDensity}
            zoom={zoom}
        />
      </Marker>
      )
    })

    LOCATIONS.forEach(location => {
      // account for null data
      let currentHourDensity = 0;
      if (averageDensityData.density[location.id]) {
        currentHourDensity = averageDensityData.density[location.id]![currentHour] ?? 0;
      }
      
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
          <MapPin density={(latestData.density[location.id] ?? 0)} averageDensity={currentHourDensity} />
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

  const defaultLongitude = -80.543275;
  const defaultLatitude = 43.47025;
  const distanceOut = 0.02;
  const bounds: [number, number, number, number] = [defaultLongitude - distanceOut, defaultLatitude - distanceOut, defaultLongitude + distanceOut, defaultLatitude + distanceOut];

  return (
    <Map
    // @ts-expect-error mapref is annoying
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{
        longitude: defaultLongitude, 
        latitude: defaultLatitude,
        zoom: 15.325, 
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
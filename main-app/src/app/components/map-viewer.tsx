"use client"

import { useMemo, useState, useRef, useCallback, useEffect} from "react";
import Map, {Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapPin from './ui/map-pin';
import LocationGraph from "./ui/location-graph";
import { map_locations } from "../config/site";
import type {MapRef} from 'react-map-gl';
import HeatmapPing from "./ui/heatmap-ping";
import { GET } from "../api/route";
import type { LocationType } from "../types/data";
import { LatestDensityData, AverageDensityDataTable } from "../types/data";

export default function MapViewer({token} : {token: string | undefined}){
  
  const [popupInfo, setPopupInfo] = useState<LocationType | null>(null);
  const [latestData, setLatestData] = useState<LatestDensityData>();
  const [heatmapPings, setHeatmapPings] = useState<JSX.Element[]>([]);
  const [heatmapPins, setHeatmapPins] = useState<JSX.Element[]>([]);
  const mapRef = useRef<MapRef>();
  const [averageDensityData, setAverageDensityData] = useState<AverageDensityDataTable>();

  const currentHour = useMemo(() => {
    return new Date().getHours();
  }, []);

  useEffect(() => {
    async function fetchData(fast: boolean) {
      const avgParams = fast ? 'fast=true' : 'fast=false';
      const responseAvg = await fetch('https://api.uwmap.live/get-average-density-transposed/?' + avgParams);
      const resJson: AverageDensityDataTable = await responseAvg.json();
      setAverageDensityData(resJson);
  
      const response = await fetch('https://api.uwmap.live/get-latest-density/');
      const latestData: LatestDensityData = await response.json();
      setLatestData(latestData);
    }

    fetchData(true)
        .catch(e => console.log(e));
    const interval = setInterval(() => fetchData(false), 5000);
    
    return () => clearInterval(interval);
}, [])

useEffect(() => {
  if (latestData?.density && averageDensityData?.density) {
    const updatedPings: JSX.Element[] = [];
    const updatedPins: JSX.Element[] = [];
    
    setHeatmapPings([]);
    setHeatmapPins([]);

    map_locations.forEach(location => {
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

    map_locations.forEach(location => {

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
      // @ts-expect-error - mapRef is not in the types
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
            currentDensity={latestData?.density[popupInfo.id] ?? 0} 
          />
        </Popup>
      )}

    </Map>
  );
}
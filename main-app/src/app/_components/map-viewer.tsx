"use client"

import { useMemo, useState, useRef, useCallback} from "react";
import Map, {Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapPin from './_map-components/map-pin';
import LocationGraph from "./_map-components/location-graph";
import LOCATIONS from "map-data/locations.json";
import type {MapRef} from 'react-map-gl';
import HeatmapPing from "./_map-components/heatmap-ping";

export default function MapViewer(){
  
  const token = "pk.eyJ1IjoiYWxleHN0YXJvc3RhIiwiYSI6ImNscDNoYXlkZTBuZDEycXAybHB2ZXM4ZjYifQ.3R4AEyIcUG5fwlJLnrjXiw"

  type LocationType = {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
  };
  
  const [popupInfo, setPopupInfo] = useState<LocationType | null>(null);
  const mapRef = useRef() as React.MutableRefObject<MapRef>;

  const pins = useMemo(
    () =>
      LOCATIONS.map((location, index) => (
        <Marker
          key={`marker-${index}`}
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
          <MapPin />
        </Marker>
      )),
    []
  );

  const [zoom, setZoom] = useState(15.5);

  const onZoom = useCallback(() => {
    const zoom = mapRef.current?.getZoom();
    if (zoom) {
      setZoom(zoom);
    }
  }, []);

  const heatmapPings = LOCATIONS.map((location, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="center"
          style={{position: "absolute", zIndex: -100}}
        >
          <HeatmapPing
              radius={550}
              zoom={zoom}
          />
        </Marker>
      ));

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

      {pins}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
        >
          <LocationGraph locationName={popupInfo.location} />
        </Popup>
      )}

    </Map>
  );
}
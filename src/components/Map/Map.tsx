import React, { useCallback, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { defaultTheme } from "./Theme";
import { updateMarker } from "../../firebase";
import styles from './Map.module.css';

interface MapProps {
    center: google.maps.LatLngLiteral;
    mode: number;
    markers: MarkerType[];
    onMarkerAdd: (coordinates: google.maps.LatLngLiteral) => void;
}

interface MarkerType {
    id: string;
    location: google.maps.LatLngLiteral;
}

const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%'
};

const defaultOption: google.maps.MapOptions = {
    panControl: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    clickableIcons: false,
    keyboardShortcuts: false,
    scrollwheel: false,
    disableDoubleClickZoom: false,
    fullscreenControl: false,
    styles: defaultTheme
};

export const MODES = {
    MOVE: 0,
    SET_MARKERS: 1
};

export const Map: React.FC<MapProps> = ({ center, mode, markers, onMarkerAdd }) => {
    const mapRef = useRef<google.maps.Map | undefined>(undefined);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = undefined;
    }, []);

    const onClick = useCallback((location: google.maps.MapMouseEvent) => {
        if (mode === MODES.SET_MARKERS) {
            const lat = location.latLng?.lat();
            const lng = location.latLng?.lng();
            if (lat !== undefined && lng !== undefined) {
                onMarkerAdd({ lat, lng });
            }
        }
    }, [mode, onMarkerAdd]);

    const handleDrag = (e: google.maps.MapMouseEvent, marker: MarkerType) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            updateMarker(marker.id, {
                id: marker.id,
                location: {
                    lat: lat,
                    lng: lng
                },
            });
        }
    };

    return (
        <div className={styles.container}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={defaultOption}
                onClick={onClick}
            >
                {markers.map((marker, ind) => (
                    <Marker
                        key={ind}
                        position={marker.location}
                        draggable={true}
                        onDragEnd={(e) => { handleDrag(e, marker) }}
                        label={{
                            text: String(marker.id),
                            color: 'white',
                            fontSize: '16px',
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};


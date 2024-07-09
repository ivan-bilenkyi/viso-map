import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { defaultTheme } from "./Theme";
import styles from './Map.module.css';
import {deleteMarkerById, getMarkers, updateMarker} from "../../firebase.ts";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const defaultOption = {
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

export const Map = ({ center, mode, markers, onMarkerAdd }) => {
    const mapRef = useRef(undefined);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = undefined;
    }, []);

    const onClick = useCallback((location) => {
        if (mode === MODES.SET_MARKERS) {
            const lat = location.latLng.lat();
            const lng = location.latLng.lng();
            onMarkerAdd({ lat, lng })
        }
    }, [mode, onMarkerAdd]);

    const handleDrag = (e: google.maps.MapMouseEvent, marker) => {
        if (e.latLng) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            updateMarker(marker.id, {
                id: marker.id,
                location: {
                    lat: lat,
                    lng: lng
                },
            });
        }
    }


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
                {markers.map(({location, id}, ind) => (
                    <Marker
                        key={ind}
                        position={location}
                        draggable={true}
                        onDragEnd={(e) => { handleDrag(e, {location, id}) }}
                        label={{
                            text: String(id),
                            color: 'white',
                            fontSize: '16px',
                        }}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

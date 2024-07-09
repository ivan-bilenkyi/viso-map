import { useJsApiLoader } from "@react-google-maps/api";
import { Map, MODES } from './components/Map';
import { Autocomplete } from "./components/Autocomplete";
import styles from './App.module.css';
import { useCallback, useEffect, useState } from "react";
import {addMarker, deleteMarkers, getMarkers} from "./firebase"; // Виправлено шлях імпорту

const API_KEY = import.meta.env.VITE_API_KEY;

const defaultCenter = {
    lat: 49.8397,
    lng: 24.0297
};

const libraries = ['places'];

function App() {
    const [center, setCenter] = useState(defaultCenter);
    const [mode, setMode] = useState(MODES.MOVE);
    const [markers, setMarkers] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
        libraries
    });

    const onPlaceSelect = useCallback(
        (coordinates) => {
            setCenter(coordinates);
        },
        []
    );

    const toggleMode = useCallback(() => {
        setMode(prevMode => prevMode === MODES.MOVE ? MODES.SET_MARKERS : MODES.MOVE);
    }, []);

    const onMarkerAdd = async (coordinates) => {
            try {
                const marker = {
                    id: markers.length + 1,
                    loc: coordinates
                };
                addMarker(marker);
                const fetchedMarkers = await getMarkers();
                setMarkers(fetchedMarkers);
            }catch (e){
                console.log(e)
            }
    };

    const clearAllMarkers = useCallback(() => {
        setMarkers([]);
        deleteMarkers()
    }, []);

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const fetchedMarkers = await getMarkers();
                if (Array.isArray(fetchedMarkers)) {
                    setMarkers(fetchedMarkers);
                } else {
                    console.error('Помилка: Отримано недійсний масив маркерів з Firebase:', fetchedMarkers);
                }
            } catch (error) {
                console.error('Помилка при отриманні маркерів з Firebase:', error);
            }
        };

        fetchMarkers();
    }, []);

    return (
        <div>
            <div className={styles.addressSearchContainer}>
                <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>
                <button
                    className={`${styles.button} ${mode === MODES.SET_MARKERS ? styles.modeToggle : ''}`}
                    onClick={toggleMode}
                >
                    Set markers
                </button>
                <button className={styles.button} onClick={clearAllMarkers}>Clear All</button>
            </div>
            {isLoaded ? <Map center={center} mode={mode} markers={markers} onMarkerAdd={onMarkerAdd}/> :
                <h2>Loading</h2>}
        </div>
    );
}

export default App;

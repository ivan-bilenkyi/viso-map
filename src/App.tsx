import {LoadScriptProps, useJsApiLoader} from "@react-google-maps/api";
import { Map, MODES } from './components/Map';
import { Autocomplete } from "./components/Autocomplete";
import styles from './App.module.css';
import { useCallback, useEffect, useState } from "react";
import {addMarker, deleteMarkers, getMarkers} from "./firebase";
import {MarkerType} from "./types.ts";

const API_KEY = import.meta.env.VITE_API_KEY;

const defaultCenter = {
    lat: 49.8397,
    lng: 24.0297
};

const libraries: LoadScriptProps['libraries'] = ['places'];


function App() {
    const [center, setCenter] = useState(defaultCenter);
    const [mode, setMode] = useState(MODES.MOVE);
    const [markers, setMarkers] = useState<MarkerType[]>([]);


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
        libraries: libraries,
    });

    const onPlaceSelect = useCallback(
        (coordinates: { lat: number, lng: number } ) => {
            setCenter(coordinates);
        },
        []
    );

    const toggleMode = useCallback(() => {
        setMode(prevMode => prevMode === MODES.MOVE ? MODES.SET_MARKERS : MODES.MOVE);
    }, []);

    const onMarkerAdd = async (coordinates: { lat: number, lng: number }) => {
            try {
                const marker: MarkerType = {
                    id: String(markers.length + 1),
                    location: coordinates,
                    timestamp: Date.now()
                };
                await addMarker(marker);
                const fetchedMarkers = await getMarkers() as MarkerType[];
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

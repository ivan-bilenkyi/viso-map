import { useJsApiLoader } from "@react-google-maps/api";
import { Map } from './components/Map';
import { Autocomplete } from "./components/Autocomplete";
import styles from './App.module.css';
import {useCallback, useState} from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

const defaultCenter = {
    lat: 49.8397,
    lng: 24.0297
};

const libraries = ['places'];

function App() {
    const [center, setCenter] = useState(defaultCenter)
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
        libraries
    });

    const onPlaceSelect = useCallback(
        (cordinates) => {
        setCenter(cordinates)
    }, [])

    return (
        <div>
            <div className={styles.addressSearchContainer}>
                <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>
                <button className={styles.modeToggle}>Set markers</button>
            </div>
            {isLoaded ? <Map center={center}/> : <h2>Loading</h2>}
        </div>
    );
}

export default App;

import React, { useEffect } from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
    Suggestion,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
    isLoaded: boolean;
    onSelect: (coordinates: google.maps.LatLngLiteral) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({ isLoaded, onSelect }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        init,
        clearSuggestions,
    } = usePlacesAutocomplete({
        callbackName: "YOUR_CALLBACK_NAME",
        initOnMount: false,
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = (suggestion: Suggestion) => () => {
        setValue(suggestion.description, false);
        clearSuggestions();

        getGeocode({ address: suggestion.description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            console.log("📍 Coordinates: ", { lat, lng });
            onSelect({ lat, lng });
        });
    };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li className={styles.listItem} key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    useEffect(() => {
        if (isLoaded) {
            init();
        }
    }, [isLoaded, init]);

    return (
        <div className={styles.container} ref={ref}>
            <input
                type='text'
                className={styles.input}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Where are you going?"
            />
            {status === "OK" && <ul className={styles.suggestions}>{renderSuggestions()}</ul>}
        </div>
    );
};


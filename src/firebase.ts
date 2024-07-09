import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove} from 'firebase/database'
import {MarkerType} from "./types.ts";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = import.meta.env.VITE_MESSAGING_SENDER_ID;
const APP_ID = import.meta.env.VITE_APP_ID;
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    databaseURL: DATABASE_URL
};

initializeApp(firebaseConfig);
const db = getDatabase();


export const addMarker = async (marker: MarkerType) => {
    try {
        await set(ref(db, `markers/${marker.id}`), {
            id: marker.id,
            location: marker.location,
            timestamp: Date.now()
        })
    }
    catch(error){
        console.log(`Error updating marker in Firebase: ${error}`)
    }
};

export const getMarkers = () => {
    return new Promise((resolve, reject) => {
        try {
            const markersRef = ref(db, 'markers');

            onValue(markersRef, (snapshot) => {
                const markers: MarkerType[] = [];
                snapshot.forEach((childSnapshot) => {
                    const marker = childSnapshot.val();
                    markers.push(marker);
                });
                resolve(markers);
            }, {
                onlyOnce: true
            });
        } catch (error) {
            console.error('Error fetching markers:', error);
            reject(error);
        }
    });
};

export const deleteMarkers = async () => {
    try {
        await remove(ref(db, 'markers'));
        console.log('Всі маркери видалено з Firebase');
    } catch (error) {
        console.error('Помилка під час видалення маркерів з Firebase:', error);
    }
};

export const updateMarker = async (markerId: string, newMarkerData: MarkerType) => {
    try {
        await set(ref(db, `markers/${markerId}`), newMarkerData);
        console.log(`Маркер з id ${markerId} оновлено в Firebase`);
    } catch (error) {
        console.error(`Помилка під час оновлення маркера з id ${markerId} в Firebase:`, error);
    }
};


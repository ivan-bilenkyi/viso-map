export interface MarkerType {
    id: string;
    location: {
        lat: number;
        lng: number;
    };
    timestamp: number;
}
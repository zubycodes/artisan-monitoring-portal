/* // src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
    return (
        <MapContainer
            center={[32.2, 75.3]} // Valid prop
                                    zoom={13}                // Valid prop
                        style={{ height: "600px" }} // Valid prop
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Valid prop
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' // Valid prop
                        />
                        <Marker position={[32.2, 75.3]}>
                            <Popup>A pretty CSS3 popup.</Popup>
                        </Marker>
        </MapContainer>
    );
};

export default Map; */
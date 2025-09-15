"use client";
import { useMemo, useState } from "react";
import Map, { Marker, NavigationControl,Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { getVenues } from "@/lib/venuesRepo";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;
const venues = getVenues();

export default function MapsPage() {
    const style = useMemo(() => `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,[]);
    const viewport = ({latitude: 41.40, longitude: 2.175, zoom: 12 });

    const [selected, setSelected] = useState(null);

    return (
        <div className="h-[75vh] rounded-xl overflow-hidden border">
            <Map
                mapLib={maplibregl}
                initialViewState={viewport}
                style={{ width: "100%", height: "100%" }}
                mapStyle={style}
            >
                <NavigationControl position="top-right" />
                {venues.map((v) => (
                    <Marker 
                        key={v.id} 
                        latitude={v.lat} 
                        longitude={v.lon} 
                        anchor="bottom" 
                        onClick={() => setSelected(null)}
                    >
                        <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        {v.name}
                        </div>
                    </Marker>
                ))}
                {selected && (() => {
                const v = venues.find(x => x.id === selected)!;
                return (
                    <Popup latitude={v.lat} longitude={v.lon} onClose={() => setSelected(null)}>
                    <div className="space-y-1">
                        <div className="font-semibold">{v.name}</div>
                        {v.district && <div className="text-xs">{v.district} · {v.neighborhood}</div>}
                        {v.category && <div className="text-xs opacity-70">{v.category}</div>}
                    </div>
                    </Popup>
                );
                })()}
            </Map>
        </div>
    );
}


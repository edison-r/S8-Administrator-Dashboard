"use client";
import { useMemo, useState, useCallback } from "react";
import Map, { Marker, NavigationControl,Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { getVenues } from "@/lib/venuesRepo";
import Link from "next/link";

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;
const venues = getVenues();

type Selected = { id: number; lat: number; lon: number } | null;

export default function MapsPage() {
    const style = useMemo(() => `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,[]);
    const viewport = ({latitude: 41.40, longitude: 2.175, zoom: 12 });

    const [selected, setSelected] = useState<Selected>(null);

    const handleMapClick = useCallback(() => setSelected(null), []);

    const selectedVenue = selected
    ? venues.find(v => v.id === selected.id) ?? null
    : null;

    return (
        <div className="h-[75vh] rounded-xl overflow-hidden border">
            <Map
                mapLib={maplibregl}
                initialViewState={viewport}
                style={{ width: "100%", height: "100%" }}
                mapStyle={style}
                onClick={handleMapClick}
            >
                <NavigationControl position="top-right" />

                {venues.map(v => (
                    <Marker key={v.id} latitude={v.lat} longitude={v.lon} anchor="bottom">
                        <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();      
                            setSelected({ id: v.id, lat: v.lat, lon: v.lon });
                        }}
                        className="bg-primary text-primary-foreground text-[10px] px-2 py-1 rounded shadow cursor-pointer hover:opacity-90 whitespace-nowrap"
                        aria-label={`Ver ${v.name}`}
                        >
                        {v.name}
                        </button>
                    </Marker>
                    ))}

                {selectedVenue && (
                    <Popup
                        latitude={selectedVenue.lat}
                        longitude={selectedVenue.lon}
                        onClose={() => setSelected(null)}
                        closeOnClick={false}
                        anchor="top"
                        offset={14}
                    >
                        <div className="space-y-1 text-sm text-primary-foreground">
                        <div className="font-semibold">{selectedVenue.name}</div>
                        {(selectedVenue.district || selectedVenue.neighborhood) && (
                            <div className="text-xs opacity-70">
                            {selectedVenue.district}{selectedVenue.district && selectedVenue.neighborhood ? " · " : ""}
                            {selectedVenue.neighborhood}
                            </div>
                        )}
                        {selectedVenue.category && (
                            <div className="text-xs">{selectedVenue.category}</div>
                        )}
                        {selectedVenue.events && selectedVenue.events.length > 0 && (
                            <div className="text-xs">
                            Próximos: {selectedVenue.events.slice(0, 2).map(e => e.title).join(". ")}
                            </div>
                        )}
                        <div className="pt-1">
                            <Link
                            href={`/dashboard/create-event?venueId=${selectedVenue.id}`}
                            className="text-xs underline"
                            >
                            Crear evento aquí
                            </Link>
                        </div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
}


"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getVenues } from "@/lib/venuesRepo";
import { buildCalendarEventsFromUser, buildCalendarEventsFromVenues } from "@/lib/eventsFromVenues";
import VenueSelect from "@/components/VenueSelect";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type CalEvent = ReturnType<typeof buildCalendarEventsFromVenues>[number];

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { es } as any,
});

const venues = getVenues();

export default function CalendarPage() {
    const [datasetEvents, setDatasetEvents] = useState<CalEvent[]>([]);
    const [userEvents, setUserEvents] = useState<CalEvent[]>([]);
    const [onlyMine, setOnlyMine] = useState(false);
    const [venueId, setVenueId] = useState<number | undefined>(undefined);

    // Carga eventos (dataset + user)
    useEffect(() => {
        const ds = buildCalendarEventsFromVenues(venues);
        setDatasetEvents(ds);
        (async () => {
        const res = await fetch("/api/events", { cache: "no-store" });
        const data = await res.json();
        const us = buildCalendarEventsFromUser(data.items ?? [], venues);
        setUserEvents(us);
        })();
    }, []);

    // Filtro combinado
    const events = useMemo(() => {
        const base = onlyMine ? userEvents : [...userEvents, ...datasetEvents];
        if (!venueId) return base;
        return base.filter(e => e.resource?.venueId === venueId);
    }, [onlyMine, venueId, datasetEvents, userEvents]);

    // Estilos por fuente (colorea “míos” diferente)
    const eventPropGetter = (e: CalEvent) => {
        const isMine = e.resource?.source === "user";
        return {
        className: cn(
            "rounded-sm border",
            isMine ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                : "bg-sky-100 border-sky-300 text-sky-900"
        ),
        // o usa style: { backgroundColor: ..., borderColor: ... } si no quieres clases
        };
    };

    return (
        <div className="space-y-3">
        {/* Controles */}
        <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="w-full md:w-[420px]">
            <Label className="mb-1 block">Filtrar por sala</Label>
            <VenueSelect value={venueId} onChange={setVenueId} placeholder="Todas las salas" />
            </div>

            <div className="flex items-center gap-2">
            <Switch checked={onlyMine} onCheckedChange={setOnlyMine} id="only-mine" />
            <Label htmlFor="only-mine">Sólo mis eventos</Label>
            </div>

            {venueId && (
            <button
                className="text-sm underline opacity-80"
                onClick={() => setVenueId(undefined)}
                type="button"
            >
                Quitar filtro de sala
            </button>
            )}
        </div>

        {/* Calendario */}
        <div className="h-[75vh] rounded-xl overflow-hidden border bg-background">
            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            style={{ height: "100%" }}
            culture="es"
            messages={{ today: "Hoy", previous: "Atrás", next: "Siguiente", month: "Mes", week: "Semana", day: "Día" }}
            tooltipAccessor={(e) => `${e.title} — ${e.resource?.venueName ?? ""}`}
            eventPropGetter={eventPropGetter}
            />
        </div>
        </div>
    );
}

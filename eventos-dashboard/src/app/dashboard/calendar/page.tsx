"use client";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getVenues } from "@/lib/venuesRepo";
import { buildCalendarEventsFromUser } from "@/lib/eventsFromVenues";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { es } as any,
});

const venues = getVenues();

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
        const res = await fetch("/api/events", { cache: "no-store" });
        const data = await res.json();
        const onlyUser = buildCalendarEventsFromUser(data.items ?? [], venues);
        setEvents(onlyUser);
        })();
    }, []);

    return (
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
        />
        </div>
    );
}

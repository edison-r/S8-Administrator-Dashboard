// app/dashboard/calendar/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer, Views, Navigate } from "react-big-calendar";
import { ToolbarProps } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { getVenues } from "@/lib/venuesRepo";
import { buildCalendarEventsFromUser } from "@/lib/eventsFromVenues";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export type CalendarEvent = {
    id: string | number;
    title: string;
    start: Date; 
    end: Date;  
    resource?: { venueId?: number; venueName?: string } | any;
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { es } as any,
});

const venues = getVenues();

function EventChip({ event, onDelete,}: {
  event: CalendarEvent;
  onDelete: (e: CalendarEvent) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md",
        "bg-primary/10 text-primary-foreground/90 border border-primary/20"
      )}
      title={event.resource?.venueName ?? event.title}
    >
      <span className="truncate text-xs md:text-sm">{event.title}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-6 w-6 ml-auto hover:bg-destructive/10"
        onClick={(ev) => {
          ev.stopPropagation(); // no abrir eventos del calendario
          onDelete(event);
        }}
        aria-label="Eliminar evento"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CustomToolbar({ label, onNavigate, onView, view }: ToolbarProps) {
    return (
        <div className="flex flex-col gap-2 p-2 border-b bg-background">
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
            <Button className="cursor-pointer" size="sm" variant="secondary" onClick={() => onNavigate(Navigate.TODAY)}>
                Hoy
            </Button>
            <Button className="cursor-pointer" size="sm" variant="outline" onClick={() => onNavigate(Navigate.PREVIOUS)}>
                Atrás
            </Button>
            <Button className="cursor-pointer" size="sm" variant="outline" onClick={() => onNavigate(Navigate.NEXT)}>
                Siguiente
            </Button>
            </div>

            <div className="text-sm font-medium select-none">{label}</div>

            <div className="flex items-center gap-2">
            <Button
                className="cursor-pointer"
                size="sm"
                variant={view === Views.MONTH ? "default" : "outline"}
                onClick={() => onView(Views.MONTH)}
            >
                Mes
            </Button>
            <Button
                className="cursor-pointer"
                size="sm"
                variant={view === Views.WEEK ? "default" : "outline"}
                onClick={() => onView(Views.WEEK)}
            >
                Semana
            </Button>
            <Button
                className="cursor-pointer"
                size="sm"
                variant={view === Views.DAY ? "default" : "outline"}
                onClick={() => onView(Views.DAY)}
            >
                Día
            </Button>
            </div>
        </div>
        </div>
    );
    }

    export default function CalendarPage() {
    const router = useRouter();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/events", { cache: "no-store" });
            const data = await res.json();
            const built = buildCalendarEventsFromUser(data.items ?? [], venues);
            setEvents(built);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleDeleteEvent = async (e: CalendarEvent) => {
        if (!e?.id) return;
        const prev = events;
        setEvents(prev.filter((evt) => evt.id !== e.id));
        const res = await fetch(`/api/events/${e.id}`, { method: "DELETE" });
        if (!res.ok) {
            setEvents(prev);
            alert("No se pudo eliminar el evento.");
        }
    };

    return (
        <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Calendario</h2>
            <Badge
                className={cn(
                events.length === 0
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                )}
            >
                {events.length} evento{events.length !== 1 ? "s" : ""}
            </Badge>
            </div>

            <div className="flex items-center gap-2">
            <Button className="cursor-pointer" variant="secondary" onClick={loadEvents} disabled={loading}>
                {loading ? "Actualizando…" : "Actualizar"}
            </Button>
            <Button className="cursor-pointer" onClick={() => router.push("/dashboard/create-event")}>Crear evento</Button>
            </div>
        </div>

        <Separator />

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
            messages={{
                today: "Hoy",
                previous: "Atrás",
                next: "Siguiente",
                month: "Mes",
                week: "Semana",
                day: "Día",
            }}
            tooltipAccessor={(e) =>
                `${(e as CalendarEvent).title} — ${
                (e as CalendarEvent).resource?.venueName ?? ""
                }`
            }
            components={{
                event: (props) => (
                <EventChip event={props.event as CalendarEvent} onDelete={handleDeleteEvent} />
                ),
                toolbar: (props) => <CustomToolbar {...props} />,
            }}
            />
        </div>

        {events.length === 0 && !loading && (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            No hay eventos para mostrar.{" "}
            <Button
                variant="link"
                className="px-1 cursor-pointer"
                onClick={() => router.push("/dashboard/create-event")}
            >
                Crea el primero
            </Button>
            .
            </div>
        )}
        </div>
    );
}

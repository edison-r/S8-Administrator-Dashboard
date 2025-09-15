"use client";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";


const locales = { es } as any;
const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
getDay,
locales,
});


const events = [
{
title: "Cine: Ciclo Noir",
start: new Date(),
end: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
},
{
title: "Concierto Jazz",
start: new Date(new Date().setDate(new Date().getDate() + 1)),
end: new Date(new Date().setDate(new Date().getDate() + 1) + 60 * 60 * 1000),
},
];


export default function CalendarPage() {
return (
<div className="h-[75vh] rounded-xl overflow-hidden border bg-background">
<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
defaultView={Views.WEEK}
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
/>
</div>
);
}
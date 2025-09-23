import type { Venue } from "@/types/venues";
import type { EventItem } from "@/types/events";

export type CalendarEvent = {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    resource?: { venueId: number; venueName: string; source: "dataset" | "user" };
};

export function buildCalendarEventsFromUser(items: EventItem[], venues: Venue[]): CalendarEvent[] {
  const byId = new Map(venues.map(v => [v.id, v]));
  return items.map(e => ({
            id: e.id,
            title: e.title,
            start: new Date(e.start),
            end: new Date(e.end),
            resource: {
                venueId: e.venueId,
                venueName: byId.get(e.venueId)?.name ?? "Sala",
                source: "user",
            }
        }));
}

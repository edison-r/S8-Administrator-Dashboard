import { create } from "zustand";
import { getVenues } from "@/lib/venuesRepo";
import { buildCalendarEventsFromUser } from "@/lib/eventsFromVenues";

export type CalendarEvent = {
    id: string | number;
    title: string;
    start: Date;
    end: Date;
    resource?: { venueId?: number; venueName?: string } | any;
};

interface EventsState {
    events: CalendarEvent[];
    loading: boolean;
    load: () => Promise<void>;
    remove: (id: CalendarEvent["id"]) => Promise<boolean>;
}

const venuesCache = getVenues();

export const useEvents = create<EventsState>((set, get) => ({
    events: [],
    loading: false,
    load: async () => {
        set({ loading: true });
        try {
            const res = await fetch("/api/events", { cache: "no-store" });
            const data = await res.json();
            const built = buildCalendarEventsFromUser(data.items ?? [], venuesCache);
            set({ events: built });
        } finally {
            set({ loading: false });
        }
    },
    remove: async (id) => {
        const prev = get().events;
        set({ events: prev.filter((e) => e.id !== id) });
        const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
        if (!res.ok) {
            set({ events: prev });
            return false;
        }
        return true;
    },
}));
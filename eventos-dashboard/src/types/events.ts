export type NewEventInput = {
    title: string;
    start: string;
    end: string;
    venueId: number;
}

export type EventItem = NewEventInput & {
    id: string;
    createdAt: string;
    source: "user" | "dataset";  
}
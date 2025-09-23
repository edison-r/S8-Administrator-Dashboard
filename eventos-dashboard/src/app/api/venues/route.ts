import { normalizeVenues } from "@/lib/normalizeVenues";
import type { RawVenue } from "@/types/venues";

export async function GET() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/data/venues.json`, { cache: "force-cache" });
    const raw: RawVenue[] = await res.json();
    const venues = normalizeVenues(raw)

    return venues;
}
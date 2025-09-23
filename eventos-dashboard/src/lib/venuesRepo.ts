import raw from "../../public/data/venues.json"
import { normalizeVenues } from "./normalizeVenues"
import type { Venue } from "@/types/venues"

const venues: Venue[] = normalizeVenues(raw as any);
export function getVenues() { return venues; }
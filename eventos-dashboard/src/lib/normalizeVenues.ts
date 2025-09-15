import type { RawVenue, Venue } from "@/types/venues"; 

export function normalizeVenue(v:RawVenue): Venue | null {

    const lat = v.geo_epgs_4326_latlon?.lat;
    const lon = v.geo_epgs_4326_latlon?.lon;

    if (lat === null || lat === undefined || lon === null || lon === undefined) return null;

    const category = v.classifications_data?.[0]?.name;
    const addr = v.addresses?.[0];

    return {
        id: v.register_id,
        name: v.name,
        lat,
        lon,
        district: addr?.district_name,
        neighborhood: addr?.neighborhood_name,
        zip: addr?.zip_code,
        category,
    };
}

export function normalizeVenues(raw: RawVenue[]): Venue[]{
    return raw.map(normalizeVenue).filter((v): v is Venue => v != null)
}
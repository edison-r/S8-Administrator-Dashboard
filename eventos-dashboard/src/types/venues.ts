export type RawVenue = {
  register_id: number;
  name: string;
  addresses?: Array<{
    district_name?: string;
    neighborhood_name?: string;
    zip_code?: string;
    /* location?: {
      type: string;
      geometries?: Array<{ type: string; coordinates: [number, number] }>;
    };*/
  }>;
  geo_epgs_4326_latlon?: { lat: number; lon: number };
  classifications_data?: Array<{ id: number; name: string }>;
  to_relationships?: Array<{
    from_entity_data?: {
      id: number,
      name: string,
      start_date?: string | null,
      end_date?: string | null;
    };
  }>;
};

export type Venue = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  district?: string;
  neighborhood?: string;
  category?: string;
  zip?: string;
  events?: Array<{ id: number; title: string; start?: string; end?: string }>
};
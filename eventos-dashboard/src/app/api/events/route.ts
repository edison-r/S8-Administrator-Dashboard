import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/eventsStore";
import { treeifyError, z } from "zod";

const Schema = z.object({
    title: z.string().min(2, {error: "Title too short."}),
    start: z.iso.datetime(),
    end: z.iso.datetime(),
    venueId: z.number(),
});

export async function GET(){
    const items = await listEvents();
    return NextResponse.json({ items, total: items.length });
}

export async function POST(req: Request){
    const body = await req.json();
    const parsed = Schema.safeParse(body);

    if(!parsed.success) return NextResponse.json({ error: treeifyError(parsed.error) }, {status: 400 });

    const created = await createEvent(parsed.data);
    return NextResponse.json(created, { status: 201})
}
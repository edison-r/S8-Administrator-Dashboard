import { NextResponse } from "next/server";
import { updateEvent, removeEvent } from "@/lib/eventsStore";
import { treeifyError, z } from "zod";

const PartialSchema = z.object({
    title: z.string().min(2).optional(),
    start: z.iso.datetime().optional(),
    end: z.iso.datetime().optional(),
    venueId: z.number().optional(),
});

export async function PATCH(_: Request, { params }: { params: { id: string } }){
    const body = await _.json();
    const parsed = PartialSchema.safeParse(body);

    if(!parsed.success) return NextResponse.json({ error: treeifyError(parsed.error) }, {status: 400 });

    const updated = await updateEvent(params.id, parsed.data);
    if(!updated) return NextResponse.json({ error: "Not found" }, {status: 400 });

    return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }){
    const ok = await removeEvent(params.id);
    if (!ok) return NextResponse.json({ error: "Not found"}, { status: 404 }); 

    return NextResponse.json({ ok: true });
}
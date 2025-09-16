import { EventItem, NewEventInput } from "@/types/events"; 
import { customAlphabet } from "nanoid";
import path from "path";
import { promises as fs, write } from "fs"; 

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12); // crea id único con el import de nanoid
const FILE = path.join(process.cwd(), "src/data/events.json");

async function readAll(): Promise<EventItem[]> {
    try {
        const raw = await fs.readFile(FILE, "utf8");
        return JSON.parse(raw) as EventItem[]; // convierte de texto a objeto
    } catch {
        return [];
    }
}

async function writeAll(items: EventItem[]){
    await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf8"); // convierte el array a JSON (indentado 2 espacios)
}

export async function listEvents(){
    return readAll();
}


export async function createEvent(input: NewEventInput){
    const item: EventItem = {
        id: nanoid(),
        ...input,
        createdAt: new Date().toISOString(),
        source: "user",
    };

    const all = await readAll();
    all.push(item);
    
    await writeAll(all);
    return item;
}

export async function updateEvent(id: string, partial: Partial<NewEventInput>){ // Partial permite modificar un campo sin necesidad de tocar todos
    const all = await readAll();
    const idx = all.findIndex(e => e.id === id);

    if(idx === -1) return null;

    all[idx] = { ...all[idx], ...partial };
    
    await writeAll(all);
    return all[idx];
}

export async function removeEvent(id: string){
    const all = await readAll();
    const next = all.filter((e) => e.id != id);

    await writeAll(next);
    return all.length !== next.length;
}
"use client";
import * as React from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVenues } from "@/lib/venuesRepo";

type Props = { value?: number; onChange: (id: number) => void; placeholder?: string; };

const venues = getVenues();

export default function VenueSelect({ value, onChange, placeholder = "Selecciona sala..." }: Props) {
  const [open, setOpen] = React.useState(false);
  const selected = venues.find(v => v.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {selected ? selected.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]">
        <Command filter={(value, search) => value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0}>
          <CommandInput placeholder="Busca por nombre o barrio..." />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {venues.map(v => (
                <CommandItem key={v.id} value={`${v.name} ${v.neighborhood ?? ""}`}>
                  <button
                    className="flex w-full items-center"
                    onClick={() => { onChange(v.id); setOpen(false); }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", v.id === value ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{v.name}</span>
                    {v.neighborhood && <span className="ml-2 text-xs opacity-60">· {v.neighborhood}</span>}
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

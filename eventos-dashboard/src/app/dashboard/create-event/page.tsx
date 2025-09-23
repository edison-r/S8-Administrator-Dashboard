"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VenueSelect from "@/components/VenueSelect";
import { Card } from "@tremor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Schema = z.object({
  title: z.string().min(2, "Título requerido"),
  start: z.string().min(1, "Inicio requerido"),
  end: z.string().min(1, "Fin requerido"),
  venueId: z.number(),
});

type FormData = z.infer<typeof Schema>; // !! muy interesante

export default function CreateEventPage() {
  const router = useRouter();
  const params = useSearchParams();
  const preselectVenue = params.get("venueId") ? Number(params.get("venueId")) : undefined;

  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: "",
      start: "",
      end: "",
      venueId: preselectVenue,
    }
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        start: new Date(data.start).toISOString(),
        end: new Date(data.end).toISOString(),
      })
    });
    if (!res.ok) {
      console.error(await res.json());
      alert("Error creando evento");
      return;
    }
    router.push("/dashboard/calendar");
  };

  return (
    <Card className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Crear Evento</h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input placeholder="Ej. Concierto indie" {...register("title")} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Inicio</Label>
            <Input type="datetime-local" {...register("start")} />
            {errors.start && <p className="text-sm text-red-500">{errors.start.message}</p>}
          </div>
          <div>
            <Label>Fin</Label>
            <Input type="datetime-local" {...register("end")} />
            {errors.end && <p className="text-sm text-red-500">{errors.end.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sala</Label>
          <VenueSelect
            value={watch("venueId")}
            onChange={(id) => setValue("venueId", id, { shouldValidate: true })}
          />
          {errors.venueId && <p className="text-sm text-red-500">Selecciona una sala</p>}
        </div>

        <div className="pt-2">
          <Button type="submit">Crear</Button>
        </div>
      </form>
    </Card>
  );
}

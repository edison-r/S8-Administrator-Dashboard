"use client";
import { Card, Title, BarChart } from "@tremor/react";

const data = [
  { month: "Ene", Cine: 12, Teatro: 8, Conciertos: 5 },
  { month: "Feb", Cine: 18, Teatro: 6, Conciertos: 9 },
  { month: "Mar", Cine: 14, Teatro: 10, Conciertos: 7 },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Title>Total eventos (30 días)</Title>
          <div className="text-3xl font-bold mt-2">72</div>
        </Card>
        <Card>
          <Title>Próximos 7 días</Title>
          <div className="text-3xl font-bold mt-2">15</div>
        </Card>
        <Card>
          <Title>Ciudad</Title>
          <div className="text-3xl font-bold mt-2">Barcelona</div>
        </Card>
      </div>

      <Card>
        <Title>Eventos por categoría</Title>
          <BarChart
          className="mt-6"
          data={data}
          index="month"
          categories={["Cine", "Teatro", "Conciertos"]}
          yAxisWidth={40}
          />
      </Card>
    </div>
  );
}
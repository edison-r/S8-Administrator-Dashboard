"use client";
import { Card, Title, DonutChart, LineChart } from "@tremor/react";


const distribution = [
{ name: "Cine", value: 38 },
{ name: "Teatro", value: 22 },
{ name: "Conciertos", value: 40 },
];


const trend = [
{ date: "2025-09-01", total: 12 },
{ date: "2025-09-02", total: 8 },
{ date: "2025-09-03", total: 15 },
];


export default function ChartsPage() {
return (
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card>
<Title>Distribución por categoría</Title>
<DonutChart data={distribution} category="value" index="name" />
</Card>
<Card>
<Title>Eventos diarios (últimos 7 días)</Title>
<LineChart data={trend} index="date" categories={["total"]} yAxisWidth={40} />
</Card>
</div>
);
}
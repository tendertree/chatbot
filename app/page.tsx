import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";
import Image from "next/image";
export default function Home() {
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>hello owld</div>

        </main>)
}

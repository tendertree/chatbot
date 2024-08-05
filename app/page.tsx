import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";
import Image from "next/image";
export default function Home() {
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
    ]
    const chartConfig = {
    } satisfies ChartConfig
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>Simple web pages</div>

        </main>)
}

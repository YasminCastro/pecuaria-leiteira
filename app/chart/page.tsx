"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import { useFilterContext } from "@/providers/FilterContext";
import axios from "axios";
import { format } from "date-fns";
import { formatTickDateDay } from "@/utils/formatXAxis";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Valor",
  },
} satisfies ChartConfig;

export default function Page() {
  const chartRef = useRef(null);
  const { date } = useFilterContext();
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    const fetchDataAndDownloadChart = async () => {
      try {
        const params = new URLSearchParams({
          date: date && date.from ? format(date?.from, "yyyy-MM-01") : "",
        });

        const response = await axios.get(
          `/api/production-chart?${params.toString()}`,
        );
        setData(response.data);

        setTimeout(async () => {
          // if (chartRef && chartRef.current) {
          //   const canvas = await html2canvas(chartRef.current);
          //   const imgData = canvas.toDataURL("image/png");
          //   const link = document.createElement("a");
          //   link.href = imgData;
          //   link.download = `producao-${date && date.from ? format(date?.from, "MM-yyyy") : ""}.png`;
          //   link.click();
          // }
        }, 2000);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAndDownloadChart();
  }, []);

  const uniqueTypes = Array.from(
    new Map(data?.map((item) => [item.type, item.color])).entries(),
  );

  const renderLegend = () => {
    return (
      <ul className="m-0 mt-3 flex list-none justify-center gap-3 p-0">
        {uniqueTypes.map(([type, color]) => (
          <li key={type} className="mb-2 flex items-center">
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: color,
                marginRight: 8,
              }}
            />
            <span>{type}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={chartRef} className="h-full w-full p-14">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatTickDateDay} />
            <YAxis>
              <Label
                value="Produção total (lt)"
                position="insideLeft"
                angle={-90}
              />
            </YAxis>
            <Legend content={renderLegend} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="value">
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  );
}

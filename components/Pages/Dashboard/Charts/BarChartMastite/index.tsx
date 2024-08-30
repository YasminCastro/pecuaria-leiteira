import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";

import stylesGraph from "../styles.module.css";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import Chart from "./Chart";
import { useFilterContext } from "@/providers/FilterContext";
import html2canvas from "html2canvas";
import { format } from "date-fns";

interface IProps {
  data: any;
}

export default function BarChartMastite({ data }: IProps) {
  const [isStackedChart, setIsStackedChart] = useState(false);
  const { date } = useFilterContext();
  const chartRef = useRef(null);

  const handleGraphChange = () => {
    setIsStackedChart(!isStackedChart);
  };

  const handleDownloadChart = async () => {
    if (chartRef && chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      const fileStartDate =
        date && date.from ? format(date?.from, "dd-MM-yyyy") : "";
      const fileEndDate = date && date.to ? format(date?.to, "dd-MM-yyyy") : "";
      let title = data.title
        .replace(/\s*\(.*?\)\s*/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      link.download = `${title}_${fileStartDate}_${fileEndDate}.png`;
      link.click();
    }
  };

  return (
    <Card className={`${stylesGraph.cardWrapper}`} ref={chartRef}>
      <div className={`${stylesGraph.graphHeader}`}>
        <h2 className={`${stylesGraph.graphTitle}`}>{data.title}</h2>
        <div className="space-x-2">
          <Button
            className={`${stylesGraph.changeGraphButton}`}
            onClick={handleDownloadChart}
          >
            <Download />
          </Button>
          <Button
            className={`${stylesGraph.changeGraphButton}`}
            onClick={handleGraphChange}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <div className={`${stylesGraph.graphWrapper}`}>
        <Chart data={data.data} isStackedChart={isStackedChart} />
      </div>
    </Card>
  );
}

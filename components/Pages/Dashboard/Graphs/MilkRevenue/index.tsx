import axios from "axios";
import { useEffect, useState } from "react";
import { useFilterContext } from "@/providers/FilterContext";
import { Card } from "@/components/ui/card";
import stylesGraph from "../styles.module.css";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import BarGraph from "./BarGraph";
import { IMilkRevenue } from "@/interfaces/Graphs/milkRevenue";
import { formatISO } from "date-fns";

export default function MilkRevenueGraph() {
  const [data, setData] = useState<IMilkRevenue[]>([]);
  const [isStackedChart, setIsStackedChart] = useState(false);
  const { selectedBatch, date } = useFilterContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          batch: selectedBatch,
          startDate: date && date.from ? formatISO(date?.from) : "",
          endDate: date && date.to ? formatISO(date?.to) : "",
        });

        const response = await axios.get(
          `/api/graph/milk-revenue?${params.toString()}`,
        );

        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedBatch, date]);

  const handleGraphChange = () => {
    setIsStackedChart(!isStackedChart);
  };

  return (
    <Card className={`${stylesGraph.cardWrapper}`}>
      <div className={`${stylesGraph.graphHeader}`}>
        <h2 className={`${stylesGraph.graphTitle}`}>Receita do leite (R$)</h2>
        <Button
          className={`${stylesGraph.changeGraphButton}`}
          onClick={handleGraphChange}
        >
          <RefreshCcw />
        </Button>
      </div>
      <div className={`${stylesGraph.graphWrapper}`}>
        <BarGraph data={data} isStackedChart={isStackedChart} />
      </div>
    </Card>
  );
}

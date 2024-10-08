import { useFilterContext } from "@/providers/FilterContext";
import { formatTickDate } from "@/utils/formatXAxis";
import { getBarColor, getBarColorByName } from "@/utils/getGraphColors";
import {
  Bar,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import styles from "./styles.module.css";
import ComposedChartTooltip from "@/components/Global/CustomTooltip/ComposedChartTooltip";
import { useState } from "react";

interface IProps {
  data: any;
  labelY: string;
  secundaryLabelY: string;
}

export default function Chart({ data, labelY, secundaryLabelY }: IProps) {
  const { batches, selectedBatch } = useFilterContext();

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [fixedKey, setFixedKey] = useState<string | null>(null);

  const handleLegendMouseEnter = (dataKey: string) => {
    if (!fixedKey) {
      setHoveredKey(dataKey);
    }
  };

  const handleLegendMouseLeave = () => {
    if (!fixedKey) {
      setHoveredKey(null);
    }
  };

  const handleLegendClick = (dataKey: any) => {
    setFixedKey((prev) => (prev === dataKey ? null : dataKey));
    setHoveredKey(null);
  };

  const getLineOpacity = (dataKey: any) => {
    if (fixedKey) {
      return fixedKey === dataKey ? 1 : 0.2;
    }
    return hoveredKey && dataKey !== hoveredKey ? 0.2 : 1;
  };

  return (
    <div className={`${styles.graphContainer}`}>
      <h2 className={`${styles.title}`}>{data.title}</h2>
      <div className={`${styles.yAxisLabelLeft}`}>{labelY}</div>
      {secundaryLabelY && (
        <div
          className={`${styles.yAxisLabelRight}`}
          key={secundaryLabelY + data.title}
        >
          {secundaryLabelY}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={data.data}
          margin={{
            right: 40,
            left: 10,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" scale="band" tickFormatter={formatTickDate} />
          <YAxis />
          <Tooltip content={<ComposedChartTooltip />} />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ lineHeight: "40px" }}
            onMouseEnter={(e: any) => handleLegendMouseEnter(e.dataKey)}
            onMouseLeave={handleLegendMouseLeave}
            onClick={(e) => handleLegendClick(e.dataKey)}
          />
          <Brush
            dataKey="date"
            height={30}
            stroke={getBarColorByName(batches, selectedBatch)}
            tickFormatter={formatTickDate}
          />
          <Bar
            dataKey="margin"
            name="Margem"
            barSize={20}
            fill={getBarColor(5)}
            opacity={getLineOpacity("margin")}
          />
          <Line
            type="monotone"
            dataKey="percent"
            name="Porcentagem"
            stroke={getBarColor(3)}
            fill={getBarColor(3)}
            opacity={getLineOpacity("percent")}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

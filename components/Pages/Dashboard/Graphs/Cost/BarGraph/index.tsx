import { useFilterContext } from "@/providers/FilterContext";
import formatBatchName from "@/utils/formatBatchName";
import { formatXAxis } from "@/utils/formatXAxis";
import { getBarColor, getBarColorByName } from "@/utils/getGraphColors";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import styles from "./styles.module.css";
import BarChartTooltip from "@/components/Global/CustomTooltip/BarChartTooltip";

interface IProps {
  data: any[];
  title: string;
  yAxisLabel: string;
}

export default function CostGraph({ data, title, yAxisLabel }: IProps) {
  const { batches, selectedBatch } = useFilterContext();

  return (
    <div className={`${styles.graphContainer}`}>
      <h2 className={`${styles.title}`}>{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis>
            <Label value={yAxisLabel} position="insideLeft" angle={-90} />
          </YAxis>
          <Tooltip content={<BarChartTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
          <ReferenceLine y={0} stroke="#000" />
          <Brush
            dataKey="date"
            height={30}
            stroke={getBarColorByName(batches, selectedBatch)}
          />
          {selectedBatch !== "all" && (
            <Bar
              dataKey="value"
              stackId="a"
              name={formatBatchName(selectedBatch, true)}
              fill={getBarColorByName(batches, selectedBatch)}
            />
          )}
          {selectedBatch === "all" &&
            batches.map((item, index) => {
              if (item.value === "all") {
                return;
              }
              return (
                <Bar
                  dataKey={formatBatchName(item.value, false, true)}
                  stackId="a"
                  name={item.label}
                  fill={getBarColor(index)}
                  key={item.label}
                />
              );
            })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

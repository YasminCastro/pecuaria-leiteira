import { useEffect, useState } from "react";
import DoubleCard from "./DoubleCard";
import SimpleCard from "./SimpleCard";
import {
  Milk,
  DollarSign,
  Activity,
  BriefcaseMedical,
  IterationCw,
  List,
  DollarSignIcon,
  Wheat,
} from "lucide-react";
import axios from "axios";
import { CardType, useFilterContext } from "@/providers/FilterContext";
import styles from "./styles.module.css";
import { format } from "date-fns";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ICard {
  title: string;
  value: number;
  title2?: string;
  value2?: number;
  cardType: "simple" | "double";
  key: CardType;
}

const defaultData = [{}, {}, {}, {}, {}, {}, {}, {}];

export default function Cards() {
  const [data, setData] = useState<ICard[]>(defaultData as ICard[]);
  const [loading, setLoading] = useState(false);
  const [parsedDate, setParsedDate] = useState("");

  const { selectedBatch, setSelectedCard, date } = useFilterContext();

  const handleCardClick = (cardKey: CardType) => {
    setSelectedCard(cardKey);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          batch: selectedBatch,
          date: date && date.from ? format(date?.from, "yyyy-MM-dd") : "",
        });

        const response = await axios.get(`/api/cards?${params.toString()}`);
        setParsedDate(
          date && date.from ? format(date?.from, "dd/MM/yyyy") : "",
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedBatch, date]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((card: ICard, index) => {
        const { icon, color } = getIconAndColor(index);

        if (card.cardType === "double" && card.title2) {
          return (
            <TooltipProvider key={`${card.key}-${index}`}>
              <Tooltip>
                <TooltipTrigger
                  className={`${styles.buttonWrapper}`}
                  onClick={() => {
                    handleCardClick(card.key);
                  }}
                >
                  <DoubleCard
                    title={card.title}
                    value={card.value}
                    title2={card.title2}
                    value2={card.value2 || 0}
                    icon={icon}
                    color={color}
                    loading={loading}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{parsedDate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return (
          <TooltipProvider key={`${card.key}-${index}`}>
            <Tooltip>
              <TooltipTrigger
                className={`${styles.buttonWrapper}`}
                onClick={() => {
                  handleCardClick(card.key);
                }}
              >
                <SimpleCard
                  title={card.title}
                  value={card.value}
                  icon={icon}
                  color={color}
                  loading={loading}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{parsedDate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

const getIconAndColor = (index: number) => {
  switch (index) {
    case 0:
      return {
        icon: <DollarSign color="#8280ff" size={36} />,
        color: "#e4e4ff",
      };
    case 1:
      return {
        icon: <Wheat color="#fec53d" size={36} />,
        color: "#fef2d6",
      };
    case 2:
      return {
        icon: <FaMoneyBillTrendUp color="#4ad991" size={32} />,
        color: "#d9f7e7",
      };
    case 3:
      return {
        icon: <DollarSignIcon color="#ff9871" size={36} />,
        color: "#ffded2",
      };
    case 4:
      return {
        icon: <Milk color="#8280ff" size={36} />,
        color: "#e4e4ff",
      };
    case 5:
      return {
        icon: <List color="#fec53d" size={36} />,
        color: "#fef2d6",
      };
    case 6:
      return {
        icon: <Activity color="#4ad991" size={36} />,
        color: "#d9f7e7",
      };
    case 7:
      return {
        icon: <BriefcaseMedical color="#ff9871" size={36} />,
        color: "#ffded2",
      };

    default:
      return {
        icon: <IterationCw color="#ff9871" size={36} />,
        color: "#ffded2",
      };
  }
};

"use client";

import { useEffect, useState } from "react";
import DoubleCard from "./DoubleCard";
import SimpleCard from "./SimpleCard";
import {
  Milk,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Activity,
  BriefcaseMedical,
  IterationCw,
  List,
} from "lucide-react";
import axios from "axios";
import { CardType, useFilterContext } from "@/providers/FilterContext";
import styles from "./styles.module.css";

interface ICard {
  title: string;
  value: number;
  title2?: string;
  value2?: number;
  cardType: "simple" | "double";
  key: CardType;
}

export default function Cards() {
  const [data, setData] = useState<ICard[]>([]);

  const { selectedBatch, setSelectedCard } = useFilterContext();

  const handleCardClick = (cardKey: CardType) => {
    setSelectedCard(cardKey);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/cards?batch=${selectedBatch}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedBatch]);

  if (!data) return <div> CARREGANDO....</div>;

  return (
    <div className="mt-4 grid grid-cols-4 gap-4">
      {data.map((card: ICard) => {
        const { icon, color } = getIconAndColor(card.title);

        if (card.cardType === "double" && card.title2) {
          return (
            <button
              className={`${styles.buttonWrapper}`}
              onClick={() => {
                handleCardClick(card.key);
              }}
              key={card.key}
            >
              <DoubleCard
                title={card.title}
                value={card.value}
                title2={card.title2}
                value2={card.value2 || 0}
                icon={icon}
                color={color}
              />
            </button>
          );
        }

        return (
          <button
            className={`${styles.buttonWrapper}`}
            onClick={() => {
              handleCardClick(card.key);
            }}
            key={card.key}
          >
            <SimpleCard
              title={card.title}
              value={card.value}
              icon={icon}
              color={color}
            />
          </button>
        );
      })}
    </div>
  );
}

const getIconAndColor = (title: string) => {
  switch (title) {
    case "Receita do leite (R$)":
      return {
        icon: <DollarSign color="#8280ff" size={36} />,
        color: "#e4e4ff",
      };
    case "Custo - Alimentação (R$)":
      return {
        icon: <ShoppingCart color="#fec53d" size={36} />,
        color: "#fef2d6",
      };
    case "Margem sobre alimentação (R$)":
      return {
        icon: <TrendingUp color="#4ad991" size={36} />,
        color: "#d9f7e7",
      };
    case "Retorno sobre investimento (%)":
      return {
        icon: <IterationCw color="#ff9871" size={36} />,
        color: "#ffded2",
      };
    case "Produção do leite (kg)":
      return {
        icon: <Milk color="#8280ff" size={36} />,
        color: "#e4e4ff",
      };
    case "Quantidade de animais":
      return {
        icon: <List color="#fec53d" size={36} />,
        color: "#fef2d6",
      };
    case "Eficiência alimentar":
      return {
        icon: <Activity color="#4ad991" size={36} />,
        color: "#d9f7e7",
      };
    case "Mastite":
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

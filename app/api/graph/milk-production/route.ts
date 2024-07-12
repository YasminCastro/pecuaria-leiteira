import api from "@/lib/api";
import formatBatchName from "@/utils/formatBatchName";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.nextUrl);
    const batch = url.searchParams.get("batch");

    let key = "";

    if (batch && batch !== "all") {
      key = formatBatchName(batch, true);
    }

    const { data } = await api.get("/producao-leite");

    const response = data.map((item: any) => {
      if (batch === "all") return item;

      return { date_record: item.date_record, value: item[key] };
    });

    response.sort((a: any, b: any) => {
      return (
        new Date(a.date_record).getTime() - new Date(b.date_record).getTime()
      );
    });

    return Response.json(response);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
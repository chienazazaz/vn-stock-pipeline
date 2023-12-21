import axios from "axios";
import fs from "fs";

import { PIPELINE, RequestConfig } from "./pipeline.const";

const getClient = () => {
  return axios.create({
    baseURL: "https://api.fireant.vn/",
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });
};

export const getData = async (
  pipeline: PIPELINE,
  { start, end }: RequestConfig
) => {
  const data: Record<string, any>[] = [];

  const client = getClient();

  const symbols = JSON.parse(
    fs.readFileSync("instruments.json", "utf8")
  ).filter((symbol: any) => symbol.type === "stock");

  for await (const symbol of symbols) {
    const response = await client
      .request(pipeline.config({ start, end, symbol: symbol.symbol }))
      .then((res) => res.data);
    data.push(...pipeline.transform(response));

    console.log(data.length);
  }

  return data;
};

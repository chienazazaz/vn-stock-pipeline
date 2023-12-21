import axios from "axios";
import { PIPELINE, RequestConfig } from "../pipeline.const";
import Joi from "joi";

export const fundamental: PIPELINE = {
  name: "fundamental",
  config: ({ start, end, symbol }: RequestConfig) => ({
    url: `/symbols/${symbol}/fundamental`,
  }),
  schema: [
    { name: "symbol", type: "STRING" },
    { name: "companyType", type: "FLOAT" },
    { name: "sharesOutstanding", type: "FLOAT" },
    { name: "freeShares", type: "FLOAT" },
    { name: "beta", type: "FLOAT" },
    { name: "dividend", type: "FLOAT" },
    { name: "dividendYield", type: "FLOAT" },
    { name: "marketCap", type: "FLOAT" },
    { name: "low52Week", type: "FLOAT" },
    { name: "high52Week", type: "FLOAT" },
    { name: "priceChange1y", type: "FLOAT" },
    { name: "avgVolume10d", type: "FLOAT" },
    { name: "avgVolume3m", type: "FLOAT" },
    { name: "pe", type: "FLOAT" },
    { name: "eps", type: "FLOAT" },
    { name: "sales_TTM", type: "FLOAT" },
    { name: "netProfit_TTM", type: "FLOAT" },
    { name: "insiderOwnership", type: "FLOAT" },
    { name: "institutionOwnership", type: "FLOAT" },
    { name: "foreignOwnership", type: "FLOAT" },
  ],
  validationSchema: Joi.object({
    symbol: Joi.string().allow(null),
    companyType: Joi.number().allow(null),
    sharesOutstanding: Joi.number().allow(null),
    freeShares: Joi.number().allow(null),
    beta: Joi.number().allow(null),
    dividend: Joi.number().allow(null),
    dividendYield: Joi.number().allow(null),
    marketCap: Joi.number().allow(null),
    low52Week: Joi.number().allow(null),
    high52Week: Joi.number().allow(null),
    priceChange1y: Joi.number().allow(null),
    avgVolume10d: Joi.number().allow(null),
    avgVolume3m: Joi.number().allow(null),
    pe: Joi.number().allow(null),
    eps: Joi.number().allow(null),
    sales_TTM: Joi.number().allow(null),
    netProfit_TTM: Joi.number().allow(null),
    insiderOwnership: Joi.number().allow(null),
    institutionOwnership: Joi.number().allow(null),
    foreignOwnership: Joi.number().allow(null),
  }),
  transform: (res: axios.AxiosResponse["data"],symbol:string) => res.map((row:{[key:string]:any})=>{
    return {...row, symbol}
  }),
};

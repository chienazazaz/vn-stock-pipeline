import axios from "axios";
import Joi from "joi";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
import { PIPELINE, RequestConfig } from "../pipeline.const";

export const financial_indicators: PIPELINE = {
  name: "financial_indicators",
  config: ({ start, end, symbol }: RequestConfig) => ({
    url: `/symbols/${symbol}/financial-indicators`,
    params: {},
  }),
  schema: [
    { name: "name", type: "STRING" },
    { name: "shortName", type: "STRING" },
    { name: "description", type: "STRING" },
    { name: "group", type: "NUMERIC" },
    { name: "groupName", type: "STRING" },
    { name: "value", type: "FLOAT" },
    { name: "change", type: "FLOAT" },
    { name: "industryValue", type: "FLOAT" },
  ],
  validationSchema: Joi.object({
    name: Joi.string().allow("", null),
    shortName: Joi.string().allow("", null),
    description: Joi.string().allow("", null),
    group: Joi.number().allow("", null),
    groupName: Joi.string().allow("", null),
    value: Joi.number().allow("", null),
    change: Joi.number().allow("", null),
    industryValue: Joi.number().allow("", null),
  }),
  transform: (res: axios.AxiosResponse["data"], symbol: string) =>
    res.map((row: { [key: string]: any }) => {
      return {...row,symbol};
    }),
};

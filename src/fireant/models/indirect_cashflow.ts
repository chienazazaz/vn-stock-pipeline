import axios from "axios";
import Joi from "joi";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat"
dayjs.extend(advancedFormat)
import { PIPELINE, RequestConfig } from "../pipeline.const";

export const indirect_cashflow: PIPELINE = {
  name: "indirect_cashflow",
  config: ({ start, end, symbol }: RequestConfig) => ({
    url: `/symbols/${symbol}/full-financial-reports`,
    params: {
      startDate: start,
      endDate: end,
      year: dayjs().format('YYYY'),
      quarter: dayjs().format('Q'),
      type: 4
    }
  }),
  schema: [
    { name: "id", type: "NUMERIC" },
    { name: "name", type: "STRING" },
    { name: "parentID", type: "NUMERIC" },
    { name: "expanded", type: "boolean" },
    { name: "level", type: "NUMERIC" },
    { name: "field", type: "STRING" },
    {
      name: "values",
      type: "RECORD",
      mode: "REPEATED",
      fields: [
        { name: "period", type: "STRING" },
        { name: "year", type: "NUMERIC" },
        { name: "quarter", type: "NUMERIC" },
        { name: "value", type: "FLOAT" },
      ],
    },
  ],
  validationSchema: Joi.object({
    id: Joi.number().allow("", null),
    name: Joi.string().allow("", null),
    parentID: Joi.number().allow("", null),
    expanded: Joi.boolean().allow("", null),
    level: Joi.number().allow("", null),
    field: Joi.string()
      .allow("", null)
      .custom((value) => value.toString()),
    values: Joi.array().items({
      period: Joi.string().allow("", null),
      year: Joi.number().allow("", null),
      quarter: Joi.number().allow("", null),
      value: Joi.number().allow("", null),
    }),
  }),
  transform: (res: axios.AxiosResponse["data"], symbol: string) =>
    res.map((row: { [key: string]: any }) => {
      return {...row, symbol};
    }),
};

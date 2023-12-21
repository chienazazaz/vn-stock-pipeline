import axios from "axios";
import Joi from "joi";
import { PIPELINE, RequestConfig } from "../pipeline.const";

export const events: PIPELINE = {
  name: "events",
  config: ({ start, end, symbol }: RequestConfig) => ({
    url: `/symbols/${symbol}/timescale-marks`,
    params: {
      startDate: start,
      endDate: end,
    },
  }),
  schema: [
    { name: "id", type: "STRING" },
    { name: "label", type: "STRING" },
    { name: "date", type: "STRING" },
    { name: "title", type: "STRING" },
    { name: "color", type: "STRING" },
  ],
  validationSchema: Joi.object({
    id: Joi.string().allow(null,''),
    label: Joi.string().allow(null,''),
    date: Joi.string().allow(null,''),
    title: Joi.string().allow(null,''),
    color: Joi.string().allow(null,''),
  }),
  transform: (res: axios.AxiosResponse["data"], symbol:string) => res.map((row:{[key:string]:any}) => {
    return {...row, symbol}
  }),
};

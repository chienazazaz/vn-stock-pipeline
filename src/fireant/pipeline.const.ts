import Joi from "joi";
import {
  balance,
  direct_cashflow,
  events,
  financial_indicators,
  fundamental,
  income_statement,
  indirect_cashflow,
  quotes,
} from "./models";
export type RequestConfig = {
  start: string;
  end: string;
  symbol?: string;
};

export type PIPELINE = {
  name: string;
  config: Function;
  schema: Record<string, any>[];
  validationSchema: Joi.Schema;
  transform: Function;
};

export const PIPELINES = [
  balance,
  direct_cashflow,
  events,
  financial_indicators,
  fundamental,
  income_statement,
  indirect_cashflow,
  quotes,
];

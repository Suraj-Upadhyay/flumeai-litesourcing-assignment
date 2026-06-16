import z from "zod";

export interface ICountryDB {
  id: number;
  name: string;
  iso: string;
  iso3: string;
  dial: string;
  currency?: string;
  currency_name?: string;
}

export const CountryDBSchema = z.object({
  id: z.number(),
  name: z.string(),
  iso: z.string(),
  iso3: z.string(),
  dial: z.string(),
  currency: z.string().nullish().optional(),
  currency_name: z.string().nullish().optional(),
});

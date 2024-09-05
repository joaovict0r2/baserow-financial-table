"use server";

import { Expense } from "./page";

export type ExpensesFilterParams = {
  phone?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  page?: string;
};

type ConverDateParams = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type ExpensesResponse = {
  count: number;
  next: string;
  previous: string;
  results: Expense[];
};

function convertDateParamsToString(params: ConverDateParams): [string | undefined, string | undefined] {
  const convertedParams = {
    startDate: params.startDate?.toISOString(),
    endDate: params.endDate?.toISOString(),
  };

  return [convertedParams.startDate, convertedParams.endDate];
}

export async function getExpenses(params: ExpensesFilterParams): Promise<ExpensesResponse> {
  const [startDateString, endDateString] = convertDateParamsToString({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  const page_query = params.page ? `&page=${params.page}` : "";

  const phone_query = params.phone
    ? `&filter__user_id__contains=${params.phone}`
    : "";

  const start_date_query = startDateString
    ? `&filter__created_on__date_after=${startDateString}`
    : "";

  const end_date_query = endDateString
    ? `&filter__created_on__date_before=${endDateString}`
    : "";

    try {
      const response = await fetch(
        `${process.env.BASEROW_BASE_URL}/database/rows/table/349242/` +
        `?user_field_names=true` +
        `${phone_query}` +
        `${start_date_query}` +
        `${end_date_query}` +
        `&size=10` +
        `${page_query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${process.env.BASEROW_TOKEN}`,
          },
        }
      );
    
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch expenses");
    }
}

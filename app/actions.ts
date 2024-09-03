"use server";

export type ExpensesFilterParams = {
  phone?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
};

type ConverDateParams = {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

function convertDateParamsToString(params: ConverDateParams): [string | undefined, string | undefined] {
  const convertedParams = {
    startDate: params.startDate?.toISOString(),
    endDate: params.endDate?.toISOString(),
  };

  return [convertedParams.startDate, convertedParams.endDate];
}

export async function getExpenses(params: ExpensesFilterParams) {
  const [startDateString, endDateString] = convertDateParamsToString({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  const start_date_query = startDateString
    ? `filter__created_on__date_after=${startDateString}`
    : "";
  const end_date_query = endDateString
    ? `filter__created_on__date_before=${endDateString}`
    : "";

  const response = await fetch(
    `${process.env.BASEROW_BASE_URL}/database/rows/table/349242/?user_field_names=true&filter__user_id__contains=${params.phone}&${start_date_query}&${end_date_query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${process.env.BASEROW_TOKEN}`,
      },
    }
  );

  return await response.json();
}

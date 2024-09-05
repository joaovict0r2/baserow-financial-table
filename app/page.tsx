"use client";

import { ExpensesResponse, getExpenses } from "@/app/actions";
import ExpensesFilter from "@/components/ExpensesFilter/ExpensesFilter";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import convertDateToGMT3 from "@/utils/convertDateToGMT3";
import { phoneMask } from "@/utils/phoneMask";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type PageProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export type Expense = {
  id: number;
  order: string;
  description: string;
  category: string;
  user_id: string;
  amount: string;
  created_on: Date;
};

export default function Home({ searchParams }: PageProps) {
  const [expenses, setExpenses] = useState<ExpensesResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [paginationLoadingStatus, setPaginationLoadingStatus] = useState<string | null>(null)

  useEffect(() => {
    fetchExpenses({ phone: searchParams.phone });
  }, []);

  async function fetchExpenses(params: any) {
    try {
      const data = await getExpenses(params);
      setExpenses(data);

    } catch (error) {
      setExpenses(undefined);

    } finally {
      setIsLoading(false);
    }
  }

  async function handleNavigation(pageUrl: string, flag: string) {
    setPaginationLoadingStatus(flag)

    const urlParams = Object.fromEntries(
      new URLSearchParams(new URL(pageUrl).search)
    );

    const queryParams = {
      phone: urlParams.filter__user_id__contains ?? undefined,
      startDate: new Date(urlParams.filter__created_on__date_after) ?? undefined,
      endDate: new Date(urlParams.filter__created_on__date_before) ?? undefined,
      page: urlParams.page ?? undefined,
    };

    const data = await getExpenses(queryParams);
    setExpenses(data);
    setPaginationLoadingStatus(null)
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <section className="w-full h-full max-h-[700px] max-w-[820px]">
        <ExpensesFilter
          className="mb-12"
          fetchExpenses={fetchExpenses}
          phone={searchParams?.phone}
        />

        {expenses?.results?.length ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[180px]">Telefone</TableHead>
                  <TableHead className="w-[50px] text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.results?.map((expense: Expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.description}
                    </TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      {convertDateToGMT3(expense.created_on)}
                    </TableCell>
                    <TableCell>{phoneMask(expense.user_id)}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(+expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="w-full flex justify-center gap-5 mt-9">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleNavigation(expenses.previous, 'next')}
                disabled={!expenses.previous || paginationLoadingStatus === 'next'}
              >
                {paginationLoadingStatus === 'next' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={() => handleNavigation(expenses.next, 'previous')}
                disabled={!expenses.next || paginationLoadingStatus === 'previous'}
              > 
                {paginationLoadingStatus === 'previous' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        ) : undefined}

        {!expenses?.results?.length && isLoading ? (
          <h3 className="text-center">Carregando...</h3>
        ) : undefined}

        {!expenses?.results?.length && !isLoading ? (
          <h3 className="text-center">Despesas não encontradas.</h3>
        ) : undefined}
      </section>
    </main>
  );
}

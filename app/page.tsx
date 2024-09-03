"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { phoneMask } from "@/utils/phoneMask";
import { getExpenses } from "@/app/actions";
import ExpensesFilter from "@/components/ExpensesFilter/ExpensesFilter";
import convertDateToGMT3 from "@/utils/convertDateToGMT3";
import { useEffect, useState } from "react";

type PageProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

type Expense = {
  id: number;
  order: string;
  description: string;
  category: string;
  user_id: string;
  amount: string;
  created_on: Date;
};

export default function Home({ searchParams }: PageProps) {
  const [expenses, setExpenses] = useState<Expense[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpenses({ phone: searchParams.phone });
  }, []);

  async function fetchExpenses(params: any) {
    try {
      const { results } = await getExpenses(params);
      setExpenses(results);
    } catch (error) {
      console.log(error)
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <section>
        <ExpensesFilter
          className="mb-12"
          fetchExpenses={fetchExpenses}
          phone={searchParams?.phone}
        />

        {expenses?.length ? (
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
              {expenses?.map((expense: Expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.description}
                  </TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{convertDateToGMT3(expense.created_on)}</TableCell>
                  <TableCell>{phoneMask(expense.user_id)}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(+expense.amount) }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : undefined}

        {!expenses?.length && isLoading ? (
          <h3 className="text-center">Carregando...</h3>
        ) : undefined}

        {!expenses?.length && !isLoading ? (
          <h3 className="text-center">Despesas não encontradas.</h3>
        ) : undefined}
      </section>
    </main>
  );
}

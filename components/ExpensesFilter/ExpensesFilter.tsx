"use client";

import { ExpensesFilterParams } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CircleBackslashIcon } from "@radix-ui/react-icons";
import { MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { DatePicker } from "../DatePicker/DatePicker";

type ExpensesFilterProps = {
  className?: string;
  fetchExpenses: (_: ExpensesFilterParams) => void;
  phone: string | undefined;
  disabled?: boolean;
};

export default function ExpensesFilter(props: ExpensesFilterProps) {
  const form = useForm({
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
    },
  });

  function onSubmit() {
    const formData = form.getValues();
    props.fetchExpenses({ ...formData, phone: props.phone });
  }

  function clear(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    form.reset();
  }

  function isFormFilled() {
    const fields = form.watch()
    return fields.endDate !== undefined || fields.startDate !== undefined
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`w-full flex items-end gap-3 ${props.className}`}
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="pb-1">Data inicial</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(date: any) => form.setValue("startDate", date)}
                  disabled={props.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data final</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={(date: any) => form.setValue("endDate", date)}
                  disabled={props.disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="outline" disabled={props.disabled}>
          filtrar
        </Button>

        <Button variant="outline" onClick={clear} disabled={!isFormFilled()}>
          <CircleBackslashIcon className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}

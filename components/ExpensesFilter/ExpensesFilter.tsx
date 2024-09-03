"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "../DatePicker/DatePicker";
import { useForm } from "react-hook-form";
import { ExpensesFilterParams } from "@/app/actions";

type ExpensesFilterProps = {
  className?: string;
  fetchExpenses: (_: ExpensesFilterParams) => void;
  phone: string | undefined;
  disabled: boolean;
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
              <FormLabel className="pb-1">Start date</FormLabel>
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
              <FormLabel>End date</FormLabel>
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

        <Button variant="outline" type="submit" disabled={props.disabled}>
          submit
        </Button>
      </form>
    </Form>
  );
}

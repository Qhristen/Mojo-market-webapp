"use client";

import { Button } from "@/components/ui/button";
import {
  Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";
import { z } from "zod";

interface BaseFormProps<T extends z.ZodObject<any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: DefaultValues<z.infer<T>>;
  children: React.ReactNode;
  submitLabel?: string;
}

export function BaseForm<T extends z.ZodObject<any>>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitLabel = "Submit",
}: BaseFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}

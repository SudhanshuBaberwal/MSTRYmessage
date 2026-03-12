"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext
} from "react-hook-form"

export const Form = FormProvider

export const FormField = Controller

export function FormItem({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="space-y-2">{children}</div>
}

export function FormLabel({
  children,
  className
}: {
  children: React.ReactNode,
  className : String
}) {
  return (
    <label className="text-sm font-medium">
      {children}
    </label>
  )
}

export function FormMessage({
  children,className
}: {
  children?: React.ReactNode,
  className : String
}) {
  if (!children) return null

  return (
    <p className="text-sm text-red-500">
      {children}
    </p>
  )

}
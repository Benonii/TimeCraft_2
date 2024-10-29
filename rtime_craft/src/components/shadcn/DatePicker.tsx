"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover";

interface DatePickerProps {
    date: Date | undefined;
    onDateChange: (date: Date) => void; // Callback for date changes
}

export function DatePicker({ date, onDateChange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              onDateChange(selectedDate); // Pass the selected date back to the parent
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

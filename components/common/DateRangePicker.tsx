"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageProvider";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = "Pick a date range",
  disabled = false,
  minDate,
  maxDate,
}: DateRangePickerProps) {

  const { locale } = useLanguage();
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "PPP", { locale: dateLocale })} - {format(date.to, "PPP", { locale: dateLocale })}
              </>
            ) : (
              format(date.from, "PPP", { locale: dateLocale })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={onDateChange}
          numberOfMonths={2}
          locale={dateLocale}
          disabled={(day) => {
            if (minDate && day < minDate) return true;
            if (maxDate && day > maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
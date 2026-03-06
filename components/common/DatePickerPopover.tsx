"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageProvider";

interface DatePickerPopoverProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  fromYear?: number;
  toYear?: number;
  disableFutureDates?: boolean;
  disablePastDates?: boolean;
}

export function DatePickerPopover({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  hasError = false,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  disableFutureDates = false,
  disablePastDates = false,
}: DatePickerPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  const { locale } = useLanguage();

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal py-5",
          !date && "text-muted-foreground",
          hasError && "border-destructive"
        )}
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP", { locale: locale === "ar" ? ar : undefined }) : <span>{placeholder}</span>}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-background rounded-lg shadow-lg p-0 animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (disableFutureDates && date > new Date()) return true;
                if (disablePastDates && date < new Date()) return true;
                if (date < new Date(fromYear, 0, 1)) return true;
                if (date > new Date(toYear, 11, 31)) return true;
                return false;
              }}
              captionLayout="dropdown"
              fromYear={fromYear}
              toYear={toYear}
              className="rounded-md border shadow-sm"
            />
          </div>
        </div>
      )}
    </>
  );
}

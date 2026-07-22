"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const PRESET_MINUTES = [5, 10, 15] as const;
const MAX_CUSTOM_MINUTES = 29;

interface ExtendMeetingDialogProps {
  disabled?: boolean;
  onConfirm: (minutes: number) => Promise<void>;
  tSession: (key: string, values?: Record<string, string | number>) => string;
}

export function ExtendMeetingDialog({
  disabled,
  onConfirm,
  tSession,
}: ExtendMeetingDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<string>("15");
  const [customMinutes, setCustomMinutes] = useState("15");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedMinutes("15");
    setCustomMinutes("15");
  }, [open]);

  const parsedCustomMinutes = useMemo(() => {
    const value = Number.parseInt(customMinutes, 10);
    if (Number.isNaN(value)) return null;
    return value;
  }, [customMinutes]);

  const isCustomValid =
    parsedCustomMinutes !== null &&
    parsedCustomMinutes > 0 &&
    parsedCustomMinutes <= MAX_CUSTOM_MINUTES;

  const activeMinutes = useMemo(() => {
    const presetValue = PRESET_MINUTES.find(
      (value) => String(value) === selectedMinutes,
    );
    if (presetValue) return presetValue;
    return isCustomValid ? parsedCustomMinutes : null;
  }, [isCustomValid, parsedCustomMinutes, selectedMinutes]);

  const handlePresetChange = (value: string) => {
    setSelectedMinutes(value);
    setCustomMinutes(value);
  };

  const handleCustomChange = (value: string) => {
    setCustomMinutes(value);

    const presetMatch = PRESET_MINUTES.some(
      (preset) => String(preset) === value,
    );
    setSelectedMinutes(presetMatch ? value : "custom");
  };

  const handleSubmit = async () => {
    if (!activeMinutes || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(activeMinutes);
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {tSession("meeting.extendMeeting")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{tSession("meeting.extendDialogTitle")}</DialogTitle>
          <DialogDescription>
            {tSession("meeting.extendDialogDescription", {
              maxMinutes: MAX_CUSTOM_MINUTES,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {tSession("meeting.extendPresetsLabel")}
            </p>
            <RadioGroup
              value={selectedMinutes}
              onValueChange={handlePresetChange}
              className="grid gap-3 sm:grid-cols-3"
            >
              {PRESET_MINUTES.map((preset) => (
                <label
                  key={preset}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                    selectedMinutes === String(preset)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <RadioGroupItem value={String(preset)} />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{preset}</p>
                    <p className="text-xs text-muted-foreground">
                      {tSession("meeting.extendMinutesLabel", {
                        count: preset,
                      })}
                    </p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="custom-extension-minutes"
              className="text-sm font-medium"
            >
              {tSession("meeting.extendCustomLabel")}
            </label>
            <Input
              id="custom-extension-minutes"
              type="number"
              min={1}
              max={MAX_CUSTOM_MINUTES}
              inputMode="numeric"
              value={customMinutes}
              onChange={(event) => handleCustomChange(event.target.value)}
              placeholder={tSession("meeting.extendCustomPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {tSession("meeting.extendCustomHint", {
                maxMinutes: MAX_CUSTOM_MINUTES,
              })}
            </p>
            {!isCustomValid && customMinutes !== "" && (
              <p className="text-xs text-destructive">
                {tSession("meeting.extendCustomError", {
                  maxMinutes: MAX_CUSTOM_MINUTES,
                })}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {tSession("meeting.cancel")}
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !activeMinutes}
          >
            {isSubmitting
              ? tSession("meeting.extending")
              : tSession("meeting.confirmExtend", {
                  minutes: activeMinutes ?? 0,
                })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

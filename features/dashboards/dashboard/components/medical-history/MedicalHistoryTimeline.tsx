"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageProvider";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  MedicalHistoryCategory,
  MedicalHistoryRecord,
} from "../../types/medicalHistory.types";

interface MedicalHistoryTimelineProps {
  records: MedicalHistoryRecord[];
  onEdit: (record: MedicalHistoryRecord) => void;
  onDelete: (record: MedicalHistoryRecord) => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}

const CATEGORY_ICONS: Record<
  MedicalHistoryCategory,
  React.ComponentType<{ className?: string }>
> = {
  LAB: FlaskConical,
  SCAN: ImageIcon,
  GENERAL: FileText,
};

const CAT_STYLE: Record<
  MedicalHistoryCategory,
  { ring: string; badge: string; iconBg: string }
> = {
  LAB: {
    ring: "ring-amber-400/40 hover:ring-amber-400 text-amber-400 border-amber-400/40",
    badge: "border-amber-400/30 bg-amber-400/10 text-amber-400",
    iconBg: "bg-amber-400/10",
  },
  SCAN: {
    ring: "ring-sky-400/40 hover:ring-sky-400 text-sky-400 border-sky-400/40",
    badge: "border-sky-400/30 bg-sky-400/10 text-sky-400",
    iconBg: "bg-sky-400/10",
  },
  GENERAL: {
    ring: "ring-violet-400/40 hover:ring-violet-400 text-violet-400 border-violet-400/40",
    badge: "border-violet-400/30 bg-violet-400/10 text-violet-400",
    iconBg: "bg-violet-400/10",
  },
};

function DesktopTimelineItem({
  record,
  isLeft,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  tMedicalHistory,
  tCommon,
}: {
  record: MedicalHistoryRecord;
  isLeft: boolean;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (r: MedicalHistoryRecord) => void;
  onDelete: (r: MedicalHistoryRecord) => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}) {
  const { locale } = useLanguage();
  const Icon = CATEGORY_ICONS[record.content.category];
  const s = CAT_STYLE[record.content.category];

  return (
    <div className="relative flex items-center gap-0">
      <div
        className={`flex flex-1 justify-end ${locale === "ar" ? "pl-8" : "pr-8"}`}
      >
        {isLeft ? (
          <DesktopCard
            record={record}
            onEdit={onEdit}
            onDelete={onDelete}
            tMedicalHistory={tMedicalHistory}
            tCommon={tCommon}
          />
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{formatDate(record.content.date, locale)}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            "border-2 bg-card shadow-md ring-2 ring-offset-2 ring-offset-background",
            "transition-all duration-200",
            s.ring,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>

      <div className={`flex flex-1 ${locale === "ar" ? "pr-8" : "pl-8"}`}>
        {!isLeft ? (
          <DesktopCard
            record={record}
            onEdit={onEdit}
            onDelete={onDelete}
            tMedicalHistory={tMedicalHistory}
            tCommon={tCommon}
          />
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{formatDate(record.content.date, locale)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopCard({
  record,
  onEdit,
  onDelete,
  tMedicalHistory,
  tCommon,
}: {
  record: MedicalHistoryRecord;
  onEdit: (r: MedicalHistoryRecord) => void;
  onDelete: (r: MedicalHistoryRecord) => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}) {
  const { locale } = useLanguage();
  const Icon = CATEGORY_ICONS[record.content.category];
  const s = CAT_STYLE[record.content.category];

  return (
    <div
      className={cn(
        "group w-full max-w-xs rounded-xl border border-border/60 bg-card p-4",
        "shadow-sm transition-all duration-200 hover:shadow-md hover:border-border",
      )}
    >
      <div
        className=
          {`flex items-start gap-2 justify-between`}
      >
        <p className={`flex-1 text-sm font-semibold leading-snug line-clamp-2`}>
          {record.content.title}
        </p>
        <Badge
          variant="outline"
          className={cn("shrink-0 gap-1 text-[10px] px-1.5 py-0.5", s.badge)}
        >
          <Icon className="h-2.5 w-2.5" />
          {tMedicalHistory(
            `categories.${record.content.category.toLowerCase()}`,
          )}
        </Badge>
      </div>

      {record.content.description && (
        <p
          className={cn(
            "mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3",
          )}
        >
          {record.content.description}
        </p>
      )}

      <div
        className={cn(
          "mt-3 flex gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
        )}
      >
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="h-7 gap-1 text-[11px]"
          onClick={() => onEdit(record)}
        >
          <Pencil className="h-3 w-3" />
          {tCommon("edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="h-7 gap-1 text-[11px] text-destructive hover:text-destructive"
          onClick={() => onDelete(record)}
        >
          <Trash2 className="h-3 w-3" />
          {tCommon("delete")}
        </Button>
      </div>
    </div>
  );
}

function MobileItem({
  record,
  isLast,
  onEdit,
  onDelete,
  tMedicalHistory,
  tCommon,
}: {
  record: MedicalHistoryRecord;
  isLast: boolean;
  onEdit: (r: MedicalHistoryRecord) => void;
  onDelete: (r: MedicalHistoryRecord) => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}) {
  const { locale } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[record.content.category];
  const s = CAT_STYLE[record.content.category];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            "border-2 bg-card ring-2 ring-offset-1 ring-offset-background shadow-sm",
            s.ring,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && <div className="mt-1 min-h-6 flex-1 w-px bg-border/40" />}
      </div>

      <div className={cn("flex-1 min-w-0", !isLast && "mb-3")}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "w-full rounded-xl border bg-card/60 px-3 py-2.5 text-left",
            "transition-all duration-200 hover:bg-card active:scale-[0.99]",
            expanded && "rounded-b-none border-b-transparent",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">
              {record.content.title}
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn("gap-1 text-[10px] px-1.5 py-0", s.badge)}
              >
                <Icon className="h-2.5 w-2.5" />
                {tMedicalHistory(
                  `categories.${record.content.category.toLowerCase()}`,
                )}
              </Badge>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  expanded && "rotate-180",
                )}
              />
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formatDate(record.content.date, locale)}
          </div>
        </button>

        {expanded && (
          <div
            className={cn(
              "rounded-b-xl border border-t-0 bg-card/40 px-3 pb-3 pt-2.5",
              "animate-in fade-in slide-in-from-top-1 duration-200",
            )}
          >
            {record.content.description && (
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {record.content.description}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 flex-1 gap-1 text-xs"
                onClick={() => onEdit(record)}
              >
                <Pencil className="h-3 w-3" />
                {tCommon("edit")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 flex-1 gap-1 text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(record)}
              >
                <Trash2 className="h-3 w-3" />
                {tCommon("delete")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MedicalHistoryTimeline({
  records,
  onEdit,
  onDelete,
  tMedicalHistory,
  tCommon,
}: MedicalHistoryTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center text-muted-foreground">
        <FileText className="h-10 w-10 opacity-20" />
        <p className="text-sm">{tMedicalHistory("noRecords")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden space-y-0">
        {records.map((record, i) => (
          <MobileItem
            key={record.recordId}
            record={record}
            isLast={i === records.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
            tMedicalHistory={tMedicalHistory}
            tCommon={tCommon}
          />
        ))}
      </div>

      <div className="hidden md:flex md:flex-col flex-1 min-h-0 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex shrink-0 items-center gap-2 border-b border-border/40 px-5 py-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <p className="text-xs text-muted-foreground">
            {tMedicalHistory("timelineHint")}
          </p>
        </div>

        <div className="relative flex-1 overflow-y-auto px-6 py-8">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-border/40" />

          <div className="relative flex flex-col gap-10">
            {records.map((record, i) => (
              <DesktopTimelineItem
                key={record.recordId}
                record={record}
                isLeft={i % 2 === 0}
                isFirst={i === 0}
                isLast={i === records.length - 1}
                onEdit={onEdit}
                onDelete={onDelete}
                tMedicalHistory={tMedicalHistory}
                tCommon={tCommon}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

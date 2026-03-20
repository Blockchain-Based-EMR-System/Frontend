"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageProvider";
import { formatDate } from "@/lib/helpers";
import {
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  MedicalHistoryCategory,
  MedicalHistoryRecord,
} from "../../types/medicalHistory.types";

interface MedicalHistoryCardProps {
  record: MedicalHistoryRecord;
  onEdit: (record: MedicalHistoryRecord) => void;
  onDelete: (record: MedicalHistoryRecord) => void;
  onOpenImage: (imageSrc: string) => void;
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

export function MedicalHistoryCard({
  record,
  onEdit,
  onDelete,
  onOpenImage,
  tMedicalHistory,
  tCommon,
}: MedicalHistoryCardProps) {
  const { locale } = useLanguage();
  const CategoryIcon = CATEGORY_ICONS[record.content.category];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{record.content.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(record.content.date, locale)}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <CategoryIcon className="h-3.5 w-3.5" />
            {tMedicalHistory(
              `categories.${record.content.category.toLowerCase()}`,
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{record.content.description}</p>

        {record.content.notes ? (
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              {tMedicalHistory("notes")}
            </p>
            <p className="mt-1 text-sm">{record.content.notes}</p>
          </div>
        ) : null}

        {record.content.images && record.content.images.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {tMedicalHistory("images")}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {record.content.images.map((imageSrc, index) => (
                <button
                  key={`${record.recordId}-image-${index}`}
                  type="button"
                  className="overflow-hidden rounded-md border transition hover:opacity-80"
                  onClick={() => onOpenImage(imageSrc)}
                >
                  <img
                    src={imageSrc}
                    alt={`${tMedicalHistory("imageAlt")} ${index + 1}`}
                    className="h-16 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => onEdit(record)}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            {tCommon("edit")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => onDelete(record)}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            {tCommon("delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

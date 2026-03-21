"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LayoutGrid, NotebookPen, Plus, Route } from "lucide-react";
import {
  MedicalHistoryRecord,
  UpsertMedicalHistoryRequest,
} from "../../types/medicalHistory.types";
import { MedicalHistoryCard } from "./MedicalHistoryCard";
import { MedicalHistoryFormDialog } from "./MedicalHistoryFormDialog";
import { DeleteMedicalHistoryDialog } from "./DeleteMedicalHistoryDialog";
import { ImageLightboxDialog } from "./ImageLightboxDialog";
import { MedicalHistorySkeleton } from "./MedicalHistorySkeleton";
import { MedicalHistoryTimeline } from "./MedicalHistoryTimeline";
import { useLanguage } from "@/contexts/LanguageProvider";

type MedicalHistoryViewMode = "cards" | "timeline";
type MedicalHistorySortOrder = "latest" | "oldest";

export interface MedicalHistoryPresentationalProps {
  records: MedicalHistoryRecord[];
  isLoading: boolean;
  isError: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  isFormOpen: boolean;
  editingRecord: MedicalHistoryRecord | null;
  recordToDelete: MedicalHistoryRecord | null;
  previewImage: string | null;
  onOpenCreate: () => void;
  onCloseForm: () => void;
  onSubmitForm: (payload: UpsertMedicalHistoryRequest) => Promise<void>;
  onEditRecord: (record: MedicalHistoryRecord) => void;
  onRequestDelete: (record: MedicalHistoryRecord) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onOpenImage: (imageSrc: string) => void;
  onCloseImage: () => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}

export function MedicalHistoryPresentational({
  records,
  isLoading,
  isError,
  isSubmitting,
  isDeleting,
  isFormOpen,
  editingRecord,
  recordToDelete,
  previewImage,
  onOpenCreate,
  onCloseForm,
  onSubmitForm,
  onEditRecord,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onOpenImage,
  onCloseImage,
  tMedicalHistory,
  tCommon,
}: MedicalHistoryPresentationalProps) {
  const { locale } = useLanguage();
  const [viewMode, setViewMode] = useState<MedicalHistoryViewMode>("cards");
  const [sortOrder, setSortOrder] = useState<MedicalHistorySortOrder>("latest");

  const sortedRecords = useMemo(() => {
    const nextRecords = [...records];

    return nextRecords.sort((firstRecord, secondRecord) => {
      const firstDate = new Date(firstRecord.content.date).getTime();
      const secondDate = new Date(secondRecord.content.date).getTime();

      return sortOrder === "latest"
        ? secondDate - firstDate
        : firstDate - secondDate;
    });
  }, [records, sortOrder]);

  if (isLoading) {
    return <MedicalHistorySkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">
              {tCommon("error")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {tMedicalHistory("title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {tMedicalHistory("description")}
            </p>
          </div>

          <Button type="button" onClick={onOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {tMedicalHistory("createAction")}
          </Button>
        </div>

        <div className="inline-flex w-fit flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-1">
          <Button
            type="button"
            size="sm"
            variant={viewMode === "cards" ? "default" : "ghost"}
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="h-4 w-4" />
            {tMedicalHistory("viewCards")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={viewMode === "timeline" ? "default" : "ghost"}
            onClick={() => setViewMode("timeline")}
          >
            <Route className="h-4 w-4" />
            {tMedicalHistory("viewTimeline")}
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <p className="mb-2 text-sm font-medium">
            {tMedicalHistory("sortByDate")}
          </p>
          <RadioGroup
            dir={locale === "ar" ? "rtl" : "ltr"}
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as MedicalHistorySortOrder)
            }
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <Label
              htmlFor="medical-history-sort-latest"
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2"
            >
              <RadioGroupItem value="latest" id="medical-history-sort-latest" />
              <span>{tMedicalHistory("latestFirst")}</span>
            </Label>

            <Label
              htmlFor="medical-history-sort-oldest"
              className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2"
            >
              <RadioGroupItem value="oldest" id="medical-history-sort-oldest" />
              <span>{tMedicalHistory("oldestFirst")}</span>
            </Label>
          </RadioGroup>
        </div>

        {sortedRecords.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <NotebookPen className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">
                {tMedicalHistory("emptyTitle")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {tMedicalHistory("emptyDescription")}
              </p>
              <Button type="button" className="mt-4" onClick={onOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {tMedicalHistory("createAction")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "cards" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {sortedRecords.map((record) => (
                  <MedicalHistoryCard
                    key={record.recordId}
                    record={record}
                    onEdit={onEditRecord}
                    onDelete={onRequestDelete}
                    onOpenImage={onOpenImage}
                    tMedicalHistory={tMedicalHistory}
                    tCommon={tCommon}
                  />
                ))}
              </div>
            ) : (
              <MedicalHistoryTimeline
                records={sortedRecords}
                onEdit={onEditRecord}
                onDelete={onRequestDelete}
                tMedicalHistory={tMedicalHistory}
                tCommon={tCommon}
              />
            )}
          </>
        )}
      </div>

      <MedicalHistoryFormDialog
        open={isFormOpen}
        onClose={onCloseForm}
        mode={editingRecord ? "edit" : "create"}
        record={editingRecord}
        isPending={isSubmitting}
        onSubmit={onSubmitForm}
        tMedicalHistory={tMedicalHistory}
        tCommon={tCommon}
      />

      <DeleteMedicalHistoryDialog
        open={!!recordToDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        record={recordToDelete}
        isPending={isDeleting}
        tMedicalHistory={tMedicalHistory}
        tCommon={tCommon}
      />

      <ImageLightboxDialog
        open={!!previewImage}
        onClose={onCloseImage}
        imageSrc={previewImage}
        title={tMedicalHistory("imagePreview")}
      />
    </>
  );
}

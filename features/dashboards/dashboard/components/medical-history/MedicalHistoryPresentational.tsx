"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, NotebookPen, Plus } from "lucide-react";
import {
  MedicalHistoryRecord,
  UpsertMedicalHistoryRequest,
} from "../../types/medicalHistory.types";
import { MedicalHistoryCard } from "./MedicalHistoryCard";
import { MedicalHistoryFormDialog } from "./MedicalHistoryFormDialog";
import { DeleteMedicalHistoryDialog } from "./DeleteMedicalHistoryDialog";
import { ImageLightboxDialog } from "./ImageLightboxDialog";

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
  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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

        {records.length === 0 ? (
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
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => (
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

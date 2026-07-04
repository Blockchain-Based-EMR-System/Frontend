"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  MedicalHistoryRecord,
  UpsertMedicalHistoryRequest,
} from "../../types/medicalHistory.types";
import {
  useCreateMedicalHistory,
  useDeleteMedicalHistory,
  usePatientMedicalHistory,
  useUpdateMedicalHistory,
} from "../../query/useMedicalHistory.query";

export interface MedicalHistoryContainerProps {
  children: (props: MedicalHistoryContainerRenderProps) => React.ReactNode;
}

export interface MedicalHistoryContainerRenderProps {
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
  onConfirmDelete: () => Promise<void>;
  onOpenImage: (imageSrc: string) => void;
  onCloseImage: () => void;
  tMedicalHistory: (key: string) => string;
  tCommon: (key: string) => string;
}

export function MedicalHistoryContainer({
  children,
}: MedicalHistoryContainerProps) {
  const tMedicalHistory = useTranslations("userDashboard.medicalHistory");
  const tCommon = useTranslations("common");

  const { data: records = [], isLoading, isError } = usePatientMedicalHistory();
  const createMutation = useCreateMedicalHistory();
  const updateMutation = useUpdateMedicalHistory();
  const deleteMutation = useDeleteMedicalHistory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<MedicalHistoryRecord | null>(null);
  const [recordToDelete, setRecordToDelete] =
    useState<MedicalHistoryRecord | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleSubmitForm = async (payload: UpsertMedicalHistoryRequest) => {
    if (editingRecord) {
      await updateMutation.mutateAsync({
        recordId: editingRecord.recordId,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    closeForm();
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) {
      return;
    }

    await deleteMutation.mutateAsync(recordToDelete.recordId);
    setRecordToDelete(null);
  };

  return (
    <>
      {children({
        records,
        isLoading,
        isError,
        isSubmitting: createMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isFormOpen,
        editingRecord,
        recordToDelete,
        previewImage,
        onOpenCreate: () => {
          setEditingRecord(null);
          setIsFormOpen(true);
        },
        onCloseForm: closeForm,
        onSubmitForm: handleSubmitForm,
        onEditRecord: (record) => {
          setEditingRecord(record);
          setIsFormOpen(true);
        },
        onRequestDelete: setRecordToDelete,
        onCancelDelete: () => setRecordToDelete(null),
        onConfirmDelete: handleConfirmDelete,
        onOpenImage: setPreviewImage,
        onCloseImage: () => setPreviewImage(null),
        tMedicalHistory,
        tCommon,
      })}
    </>
  );
}

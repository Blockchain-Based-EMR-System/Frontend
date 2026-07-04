"use client";

import { type ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSoapDraftStore } from "@/stores/useSoapDraftStore";

export interface SoapReviewPresentationalProps {
  appointmentId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  hasDraft: boolean;
  onFieldChange: (
    field: "subjective" | "objective" | "assessment" | "plan",
    value: string,
  ) => void;
  onBack: () => void;
  onConfirm: () => void;
  tSession: (key: string) => string;
  tCommon: (key: string) => string;
}

export interface SoapReviewContainerProps {
  appointmentId: string;
  children: (props: SoapReviewPresentationalProps) => ReactNode;
}

export function SoapReviewContainer({
  appointmentId,
  children,
}: SoapReviewContainerProps) {
  const router = useRouter();
  const tSession = useTranslations("doctorDashboard.sessions");
  const tCommon = useTranslations("common");

  const appointmentState = useSoapDraftStore(
    (state) => state.byAppointment[appointmentId],
  );
  
  const setDraftField = useSoapDraftStore((state) => state.setDraftField);

  const draft = useMemo(() => {
    return (
      appointmentState?.draft ?? {
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
      }
    );
  }, [appointmentState?.draft]);

  return (
    <>
      {children({
        appointmentId,
        subjective: draft.subjective,
        objective: draft.objective,
        assessment: draft.assessment,
        plan: draft.plan,
        hasDraft: Boolean(appointmentState?.draft),
        onFieldChange: (field, value) =>
          setDraftField(appointmentId, field, value),
        onBack: () => router.push("/doctor-dashboard/appointments"),
        onConfirm: () => {
          if (!appointmentState?.draft) return;
          appointmentState.status = "confirmed";
          router.push("/doctor-dashboard/appointments");
        },
        tSession,
        tCommon,
      })}
    </>
  );
}

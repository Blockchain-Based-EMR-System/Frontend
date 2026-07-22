"use client";

import { useTranslations } from "next-intl";
import { DoctorJoinFormData } from "../types/doctorJoinTypes";
import { useDoctorJoin } from "../query/useDoctorJoin.query";

export interface DoctorJoinContainerProps {
  children: (props: DoctorJoinPresentationalProps) => React.ReactNode;
}

export interface DoctorJoinPresentationalProps {
  isLoading: boolean;
  handleJoin: (data: DoctorJoinFormData) => Promise<void>;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tDoctorJoining: (key: string, values?: Record<string, any>) => string;
  tFields: (key: string, values?: Record<string, any>) => string;
}

export function DoctorJoinContainer({ children }: DoctorJoinContainerProps) {
  const tDoctorJoining = useTranslations("doctorJoining");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("fields");

  const joinMutation = useDoctorJoin();

  const handleJoin = async (data: DoctorJoinFormData) => {
    await joinMutation.mutateAsync(data);
  };

  return (
    <>
      {children({
        isLoading: joinMutation.isPending,
        handleJoin,
        tCommon,
        tDoctorJoining,
        tFields,
      })}
    </>
  );
}

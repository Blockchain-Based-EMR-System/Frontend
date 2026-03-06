"use client";

import { useTranslations } from "next-intl";
import { NurseJoinFormData } from "../types/nurseJoinTypes";
import { useNurseJoin } from "../query/useNurseJoin.query";
import { NurseJoinPresentationalProps } from "./NurseJoinPresentational";

export interface NurseJoinContainerProps {
  children: (props: NurseJoinPresentationalProps) => React.ReactNode;
}

export function NurseJoinContainer({ children }: NurseJoinContainerProps) {
  const tNurse = useTranslations("nurseJoining");
  const tCommon = useTranslations("common");
  const tFields = useTranslations("fields");

  const joinMutation = useNurseJoin();

  const handleJoin = async (data: NurseJoinFormData) => {
    await joinMutation.mutateAsync(data);
  };

  return (
    <>
      {children({
        isLoading: joinMutation.isPending,
        handleJoin,
        tCommon,
        tNurse,
        tFields,
      })}
    </>
  );
}

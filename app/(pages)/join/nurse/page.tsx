"use client";

import { NurseJoinContainer } from "@/features/join/nurse/components/NurseJoinContainer";
import { NurseJoinPresentational } from "@/features/join/nurse/components/NurseJoinPresentational";

export default function NurseJoinPage() {
  return (
    <NurseJoinContainer>
      {(props) => <NurseJoinPresentational {...props} />}
    </NurseJoinContainer>
  );
}

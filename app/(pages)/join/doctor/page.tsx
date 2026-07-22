"use client";

import { DoctorJoinContainer } from "@/features/join/doctor/components/DoctorJoinContainer";
import { DoctorJoinPresentational } from "@/features/join/doctor/components/DoctorJoinPresentational";

export default function DoctorJoinPage() {
  return (
    <DoctorJoinContainer>
      {(props) => <DoctorJoinPresentational {...props} />}
    </DoctorJoinContainer>
  );
}

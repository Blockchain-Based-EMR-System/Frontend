import { ReactNode } from "react";
import { ApiResponse } from "@/types";

export type VisitRecordType = "VISIT_SUMMARY";
export type SoapTab = "subjective" | "objective" | "assessment" | "plan";

export interface SubjectiveHistoryOfPresentIllness {
	onset: string;
	location: string;
	duration: string;
	character: string;
	aggravatingAlleviatingFactors: string;
	severity: string;
}

export interface ObjectiveVitalSigns {
	bloodPressure: string;
	heartRate: string;
	respiratoryRate: string;
	temperature: string;
}

export interface AssessmentModel {
	diagnosisType: string;
	condition: string;
	icd10Code: string;
	status: string;
	rationale: string;
}

export interface PlanMedications {
	name: string;
	dosage: string;
	frequency: string;
	duration: string;
}

export interface PlanInstructions {
	activity: string;
	followUp: string;
}

export interface SOAPOfflineDraft {
	encounterDate: string;
	chiefComplaint: string;
	attendingProvider: string;
	Subjective: {
		historyOfPresentIllness: SubjectiveHistoryOfPresentIllness;
	};
	Objective: {
		vitalSigns: ObjectiveVitalSigns;
		physicalExamination: string;
		diagnosticResults: string;
	};
	Assessment: AssessmentModel;
	Plan: {
		medications: PlanMedications[];
		inistructions: PlanInstructions;
	};
}

export interface SOAPOfflinePayload {
	encounterDate: string;
	chiefComplaint: string;
	attendingProvider: string;
	Subjective: {
		historyOfPresentIllness: {
			onset: string;
			location: string;
			duration: string;
			character: string;
			aggravatingAlleviatingFactors: string;
			severity: number;
		};
	};
	Objective: {
		vitalSigns: {
			bloodPressure: string;
			heartRate: number;
			respiratoryRate: number;
			temperature: string;
		};
		physicalExamination: string;
		diagnosticResults: string;
	};
	Assessment: AssessmentModel;
	Plan: {
		medications: PlanMedications[];
		inistructions: PlanInstructions;
	};
}

export interface CreateDoctorRecordPayload {
	name: string;
	type: VisitRecordType;
	content: SOAPOfflinePayload;
}

export interface CreateDoctorRecordData {
	recordId: string;
}

export type CreateDoctorRecordResponse = ApiResponse<CreateDoctorRecordData>;

export interface AppointmentContextData {
	appointmentId: string;
	clinicId: string;
	patientId: string;
}

export type AppointmentContextResponse = ApiResponse<AppointmentContextData>;

export interface SubmitSoapOfflineInput {
	clinicId: string;
	patientId: string;
	payload: CreateDoctorRecordPayload;
}

export interface SOAPOfflinePresentationalProps {
	activeTab: SoapTab;
	draft: SOAPOfflineDraft;
	isSubmitting: boolean;
	isLoadingContext: boolean;
	isFormValid: boolean;
	onTabChange: (tab: SoapTab) => void;
	onSectionFieldChange: (
		section: SoapTab,
		field: string,
		value: string,
		itemIndex?: number,
	) => void;
	onAddMedication: () => void;
	onRemoveMedication: (index: number) => void;
	onReset: () => void;
	onSubmit: () => Promise<void>;
	tSession: (key: string) => string;
	tCommon: (key: string) => string;
}

export interface SOAPOfflineContainerProps {
	appointmentId: string;
	children: (props: SOAPOfflinePresentationalProps) => ReactNode;
}


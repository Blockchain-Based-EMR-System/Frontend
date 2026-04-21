import { api } from "@/lib/apiClient";
import {
	AppointmentContextResponse,
	CreateDoctorRecordPayload,
	CreateDoctorRecordResponse,
	SOAPOfflineDraft,
	SubmitSoapOfflineInput,
} from "../types/SOAPOffline.types";

export const DEFAULT_SOAP_OFFLINE_DRAFT: SOAPOfflineDraft = {
	encounterDate: new Date().toISOString().slice(0, 10),
	chiefComplaint: "",
	attendingProvider: "",
	Subjective: {
		historyOfPresentIllness: {
			onset: "",
			location: "",
			duration: "",
			character: "",
			aggravatingAlleviatingFactors: "",
			severity: "",
		},
	},
	Objective: {
		vitalSigns: {
			bloodPressure: "",
			heartRate: "",
			respiratoryRate: "",
			temperature: "",
		},
		physicalExamination: "",
		diagnosticResults: "",
	},
	Assessment: {
		diagnosisType: "Primary",
		condition: "",
		icd10Code: "",
		status: "Active",
		rationale: "",
	},
	Plan: {
		medications: [
			{
				name: "",
				dosage: "",
				frequency: "",
				duration: "",
			},
		],
		inistructions: {
			activity: "",
			followUp: "",
		},
	},
};

export const getDefaultSoapOfflineDraft = (
	attendingProvider = "",
): SOAPOfflineDraft => ({
	encounterDate: new Date().toISOString().slice(0, 10),
	chiefComplaint: "",
	attendingProvider,
	Subjective: {
		historyOfPresentIllness: {
			onset: "",
			location: "",
			duration: "",
			character: "",
			aggravatingAlleviatingFactors: "",
			severity: "",
		},
	},
	Objective: {
		vitalSigns: {
			bloodPressure: "",
			heartRate: "",
			respiratoryRate: "",
			temperature: "",
		},
		physicalExamination: "",
		diagnosticResults: "",
	},
	Assessment: {
		diagnosisType: "Primary",
		condition: "",
		icd10Code: "",
		status: "Active",
		rationale: "",
	},
	Plan: {
		medications: [
			{
				name: "",
				dosage: "",
				frequency: "",
				duration: "",
			},
		],
		inistructions: {
			activity: "",
			followUp: "",
		},
	},
});

export const createSoapOfflinePayload = (
	appointmentId: string,
	draft: SOAPOfflineDraft,
): CreateDoctorRecordPayload => {
	const severity = Number(draft.Subjective.historyOfPresentIllness.severity || 0);
	const heartRate = Number(draft.Objective.vitalSigns.heartRate || 0);
	const respiratoryRate = Number(draft.Objective.vitalSigns.respiratoryRate || 0);
	const medications = draft.Plan.medications.filter(
		(item) =>
			item.name.trim() ||
			item.dosage.trim() ||
			item.frequency.trim() ||
			item.duration.trim(),
	);

	return {
		name: `Visit Summary ${draft.encounterDate} (${appointmentId.slice(0, 8)})`,
		type: "VISIT_SUMMARY",
		content: {
			encounterDate: draft.encounterDate,
			chiefComplaint: draft.chiefComplaint,
			attendingProvider: draft.attendingProvider,
			Subjective: {
				historyOfPresentIllness: {
					onset: draft.Subjective.historyOfPresentIllness.onset,
					location: draft.Subjective.historyOfPresentIllness.location,
					duration: draft.Subjective.historyOfPresentIllness.duration,
					character: draft.Subjective.historyOfPresentIllness.character,
					aggravatingAlleviatingFactors:
						draft.Subjective.historyOfPresentIllness.aggravatingAlleviatingFactors,
					severity,
				},
			},
			Objective: {
				vitalSigns: {
					bloodPressure: draft.Objective.vitalSigns.bloodPressure,
					heartRate,
					respiratoryRate,
					temperature: draft.Objective.vitalSigns.temperature,
				},
				physicalExamination: draft.Objective.physicalExamination,
				diagnosticResults: draft.Objective.diagnosticResults,
			},
			Assessment: draft.Assessment,
			Plan: {
				...draft.Plan,
				medications,
			},
		},
	};
};

export const submitSoapOfflineRecord = async ({
	clinicId,
	patientId,
	payload,
}: SubmitSoapOfflineInput): Promise<CreateDoctorRecordResponse> => {
	return api.post<CreateDoctorRecordResponse>(
		`/medical-records/clinics/${clinicId}/patients/${patientId}/visit-summaries`,
		payload,
	);
};

export const getDoctorAppointmentContext = async (
	appointmentId: string,
): Promise<AppointmentContextResponse> => {
	return api.get<AppointmentContextResponse>(
		`/appointments/doctor/${appointmentId}/context`,
	);
};


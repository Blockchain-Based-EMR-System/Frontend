"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/useToast";
import { useSoapDraftStore } from "@/stores/useSoapDraftStore";
import { useUserStore } from "@/stores/useUserStore";
import {
	createSoapOfflinePayload,
	getDefaultSoapOfflineDraft,
} from "../../api/SOAPOffline.api";
import {
	useDoctorAppointmentContext,
	useSubmitSoapOfflineRecord,
} from "../../query/useSOAPOffline.query";
import {
	SOAPOfflineContainerProps,
	SOAPOfflineDraft,
	SoapTab,
} from "../../types/SOAPOffline.types";

const mergeText = (doctorValue: string, aiValue: string): string => {
	const normalizedDoctorValue = doctorValue.trim();
	const normalizedAiValue = aiValue.trim();

	if (!normalizedAiValue) {
		return doctorValue;
	}

	if (!normalizedDoctorValue) {
		return aiValue;
	}

	if (normalizedDoctorValue.includes(normalizedAiValue)) {
		return doctorValue;
	}

	return `${doctorValue}\n\n${aiValue}`;
};

export function SOAPOfflineContainer({
	appointmentId,
	children,
}: SOAPOfflineContainerProps) {
	const router = useRouter();
	const tSession = useTranslations("doctorDashboard.sessions");
	const tCommon = useTranslations("common");
	const user = useUserStore((state) => state.user);
	const aiDraft = useSoapDraftStore(
		(state) => state.byAppointment[appointmentId]?.draft,
	);
	const providerName = user?.name?.trim() ?? "";

	const [activeTab, setActiveTab] = useState<SoapTab>("subjective");
	const [draft, setDraft] = useState<SOAPOfflineDraft>(() =>
		getDefaultSoapOfflineDraft(providerName),
	);
	const [hasMergedAiDraft, setHasMergedAiDraft] = useState(false);

	const getContextMutation = useDoctorAppointmentContext();
	const submitRecordMutation = useSubmitSoapOfflineRecord();

	const isLoadingContext = getContextMutation.isPending;
	const isSubmitting = submitRecordMutation.isPending;

	useEffect(() => {
		if (!providerName) {
			return;
		}

		setDraft((prev) => {
			if (prev.attendingProvider.trim().length > 0) {
				return prev;
			}

			return {
				...prev,
				attendingProvider: providerName,
			};
		});
	}, [providerName]);

	useEffect(() => {
		setHasMergedAiDraft(false);
	}, [appointmentId]);

	useEffect(() => {
		if (!aiDraft || hasMergedAiDraft) {
			return;
		}

		setDraft((prev) => ({
			...prev,
			chiefComplaint: mergeText(prev.chiefComplaint, aiDraft.subjective),
			Subjective: {
				...prev.Subjective,
				historyOfPresentIllness: {
					...prev.Subjective.historyOfPresentIllness,
					character: mergeText(
						prev.Subjective.historyOfPresentIllness.character,
						aiDraft.subjective,
					),
				},
			},
			Objective: {
				...prev.Objective,
				physicalExamination: mergeText(
					prev.Objective.physicalExamination,
					aiDraft.objective,
				),
				diagnosticResults: mergeText(
					prev.Objective.diagnosticResults,
					aiDraft.objective,
				),
			},
			Assessment: {
				...prev.Assessment,
				condition: mergeText(prev.Assessment.condition, aiDraft.assessment),
				rationale: mergeText(prev.Assessment.rationale, aiDraft.assessment),
			},
			Plan: {
				...prev.Plan,
				inistructions: {
					...prev.Plan.inistructions,
					activity: mergeText(prev.Plan.inistructions.activity, aiDraft.plan),
					followUp: mergeText(prev.Plan.inistructions.followUp, aiDraft.plan),
				},
			},
		}));

		setHasMergedAiDraft(true);
	}, [aiDraft, hasMergedAiDraft]);

	const isFormValid = useMemo(() => {
		return [
			draft.encounterDate,
			draft.chiefComplaint,
			draft.attendingProvider,
			draft.Subjective.historyOfPresentIllness.location,
			draft.Objective.physicalExamination,
			draft.Assessment.condition,
			draft.Plan.medications.some((med) => med.name.trim()) ? "ok" : "",
			draft.Plan.inistructions.followUp,
		].every((value) => value.trim().length > 0);
	}, [draft]);

	const onSectionFieldChange = (
		section: SoapTab,
		field: string,
		value: string,
		itemIndex?: number,
	) => {
		const subjectiveRoot = new Set([
			"encounterDate",
			"chiefComplaint",
			"attendingProvider",
		]);
		const subjectiveNested = new Set([
			"onset",
			"location",
			"duration",
			"character",
			"aggravatingAlleviatingFactors",
			"severity",
		]);
		const objectiveVital = new Set([
			"bloodPressure",
			"heartRate",
			"respiratoryRate",
			"temperature",
		]);
		const objectiveRoot = new Set(["physicalExamination", "diagnosticResults"]);
		const planMedication = new Set(["name", "dosage", "frequency", "duration"]);
		const planInstruction = new Set(["activity", "followUp"]);

		setDraft((prev) => {
			if (section === "subjective") {
				if (subjectiveRoot.has(field)) {
					return {
						...prev,
						[field]: value,
					};
				}

				if (subjectiveNested.has(field)) {
					return {
						...prev,
						Subjective: {
							...prev.Subjective,
							historyOfPresentIllness: {
								...prev.Subjective.historyOfPresentIllness,
								[field]: value,
							},
						},
					};
				}
			}

			if (section === "objective") {
				if (objectiveVital.has(field)) {
					return {
						...prev,
						Objective: {
							...prev.Objective,
							vitalSigns: {
								...prev.Objective.vitalSigns,
								[field]: value,
							},
						},
					};
				}

				if (objectiveRoot.has(field)) {
					return {
						...prev,
						Objective: {
							...prev.Objective,
							[field]: value,
						},
					};
				}
			}

			if (section === "assessment") {
				return {
					...prev,
					Assessment: {
						...prev.Assessment,
						[field]: value,
					},
				};
			}

			if (section === "plan") {
				if (planMedication.has(field)) {
					if (itemIndex === undefined) {
						return prev;
					}
					return {
						...prev,
						Plan: {
							...prev.Plan,
							medications: prev.Plan.medications.map((med, index) =>
								index === itemIndex ? { ...med, [field]: value } : med,
							),
						},
					};
				}

				if (planInstruction.has(field)) {
					return {
						...prev,
						Plan: {
							...prev.Plan,
							inistructions: {
								...prev.Plan.inistructions,
								[field]: value,
							},
						},
					};
				}
			}

			return prev;
		});
	};

	const onAddMedication = () => {
		setDraft((prev) => ({
			...prev,
			Plan: {
				...prev.Plan,
				medications: [
					...prev.Plan.medications,
					{ name: "", dosage: "", frequency: "", duration: "" },
				],
			},
		}));
	};

	const onRemoveMedication = (indexToRemove: number) => {
		setDraft((prev) => {
			if (prev.Plan.medications.length === 1) {
				return {
					...prev,
					Plan: {
						...prev.Plan,
						medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
					},
				};
			}

			return {
				...prev,
				Plan: {
					...prev.Plan,
					medications: prev.Plan.medications.filter(
						(_item, index) => index !== indexToRemove,
					),
				},
			};
		});
	};

	const onReset = () => {
		setDraft(getDefaultSoapOfflineDraft(providerName));
		setHasMergedAiDraft(false);
		setActiveTab("subjective");
	};

	const onSubmit = async () => {
		if (!isFormValid) {
			toast({
				title: tCommon("error"),
				description: tSession("soapOffline.messages.required"),
				variant: "destructive",
			});
			return;
		}

		try {
			const context = await getContextMutation.mutateAsync(appointmentId);
			const appointmentContext = context.data;

			if (!appointmentContext?.clinicId || !appointmentContext?.patientId) {
				throw new Error(tSession("soapOffline.messages.missingContext"));
			}

			const payload = createSoapOfflinePayload(appointmentId, draft);

			await submitRecordMutation.mutateAsync({
				clinicId: appointmentContext.clinicId,
				patientId: appointmentContext.patientId,
				payload,
			});

			toast({
				title: tCommon("success"),
				description: tSession("soapOffline.messages.saved"),
			});

			// router.push(`/doctor-dashboard/appointments/${appointmentId}/soap-review`);
		} catch {
			toast({
				title: tCommon("error"),
				description: tSession("soapOffline.messages.saveFailed"),
				variant: "destructive",
			});
		}
	};

	return (
		<>
			{children({
				activeTab,
				draft,
				isSubmitting,
				isLoadingContext,
				isFormValid,
				onTabChange: setActiveTab,
				onSectionFieldChange,
				onAddMedication,
				onRemoveMedication,
				onReset,
				onSubmit,
				tSession,
				tCommon,
			})}
		</>
	);
}


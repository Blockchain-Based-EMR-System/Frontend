"use client";

import { useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { SOAPOfflinePresentationalProps } from "../../types/SOAPOffline.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type TabKey = "subjective" | "objective" | "assessment" | "plan";

export function SOAPOfflinePresentational({
	activeTab,
	draft,
	isSubmitting,
	isLoadingContext,
	isFormValid,
	onTabChange,
	onSectionFieldChange,
	onAddMedication,
	onRemoveMedication,
	onReset,
	onSubmit,
	tSession,
	tCommon,
}: SOAPOfflinePresentationalProps) {
	const [showSaveDialog, setShowSaveDialog] = useState(false);

	const tabs: Array<{ key: TabKey; label: string }> = [
		{ key: "subjective", label: tSession("soapOffline.tabs.subjective") },
		{ key: "objective", label: tSession("soapOffline.tabs.objective") },
		{ key: "assessment", label: tSession("soapOffline.tabs.assessment") },
		{ key: "plan", label: tSession("soapOffline.tabs.plan") },
	];

	const handleConfirmSave = async () => {
		await onSubmit();
		setShowSaveDialog(false);
	};

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle>{tSession("soapOffline.title")}</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
					{tabs.map((tab) => (
						<Button
							key={tab.key}
							type="button"
							variant={activeTab === tab.key ? "default" : "outline"}
							onClick={() => onTabChange(tab.key)}
							className={cn("justify-center")}
							disabled={isSubmitting}
						>
							{tab.label}
						</Button>
					))}
				</div>

				{activeTab === "subjective" && (
					<div className="space-y-3 rounded-lg border p-4">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="encounterDate">{tSession("soapOffline.fields.encounterDate")} *</Label>
								<Input
									id="encounterDate"
									type="date"
									value={draft.encounterDate}
									onChange={(event) =>
										onSectionFieldChange(
											"subjective",
											"encounterDate",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="attendingProvider">{tSession("soapOffline.fields.attendingProvider")} *</Label>
								<Input
									id="attendingProvider"
									value={draft.attendingProvider}
									onChange={(event) =>
										onSectionFieldChange(
											"subjective",
											"attendingProvider",
											event.target.value,
										)
									}
									placeholder={tSession("soapOffline.placeholders.attendingProvider")}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="chiefComplaint">{tSession("soapOffline.fields.chiefComplaint")} *</Label>
							<Input
								id="chiefComplaint"
								value={draft.chiefComplaint}
								onChange={(event) =>
									onSectionFieldChange(
										"subjective",
										"chiefComplaint",
										event.target.value,
									)
								}
								placeholder={tSession("soapOffline.placeholders.chiefComplaint")}
								disabled={isSubmitting}
							/>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="onset">{tSession("soapOffline.fields.onset")}</Label>
								<Input
									id="onset"
									value={draft.Subjective.historyOfPresentIllness.onset}
									onChange={(event) =>
										onSectionFieldChange(
											"subjective",
											"onset",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">{tSession("soapOffline.fields.location")} *</Label>
								<Input
									id="location"
									value={draft.Subjective.historyOfPresentIllness.location}
									onChange={(event) =>
										onSectionFieldChange("subjective", "location", event.target.value)
									}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="duration">{tSession("soapOffline.fields.duration")}</Label>
								<Input
									id="duration"
									value={draft.Subjective.historyOfPresentIllness.duration}
									onChange={(event) =>
										onSectionFieldChange("subjective", "duration", event.target.value)
									}
									disabled={isSubmitting}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="character">{tSession("soapOffline.fields.character")}</Label>
								<Input
									id="character"
									value={draft.Subjective.historyOfPresentIllness.character}
									onChange={(event) =>
										onSectionFieldChange("subjective", "character", event.target.value)
									}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="aggravatingAlleviatingFactors">
								{tSession("soapOffline.fields.aggravatingAlleviatingFactors")}
							</Label>
							<Textarea
								id="aggravatingAlleviatingFactors"
								value={draft.Subjective.historyOfPresentIllness.aggravatingAlleviatingFactors}
								onChange={(event) =>
									onSectionFieldChange(
										"subjective",
										"aggravatingAlleviatingFactors",
										event.target.value,
									)
								}
								rows={2}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="severity">{tSession("soapOffline.fields.severity")}</Label>
							<Input
								id="severity"
								type="number"
								min={0}
								max={10}
								value={draft.Subjective.historyOfPresentIllness.severity}
								onChange={(event) =>
									onSectionFieldChange("subjective", "severity", event.target.value)
								}
								disabled={isSubmitting}
							/>
						</div>
					</div>
				)}

				{activeTab === "objective" && (
					<div className="space-y-3 rounded-lg border p-4">
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="bloodPressure">{tSession("soapOffline.fields.bloodPressure")}</Label>
								<Input
									id="bloodPressure"
									value={draft.Objective.vitalSigns.bloodPressure}
									onChange={(event) =>
										onSectionFieldChange(
											"objective",
											"bloodPressure",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="heartRate">{tSession("soapOffline.fields.heartRate")}</Label>
								<Input
									id="heartRate"
									type="number"
									value={draft.Objective.vitalSigns.heartRate}
									onChange={(event) =>
										onSectionFieldChange(
											"objective",
											"heartRate",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						<div className="grid gap-3 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="respiratoryRate">{tSession("soapOffline.fields.respiratoryRate")}</Label>
								<Input
									id="respiratoryRate"
									type="number"
									value={draft.Objective.vitalSigns.respiratoryRate}
									onChange={(event) =>
										onSectionFieldChange(
											"objective",
											"respiratoryRate",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="temperature">{tSession("soapOffline.fields.temperature")}</Label>
								<Input
									id="temperature"
									value={draft.Objective.vitalSigns.temperature}
									onChange={(event) =>
										onSectionFieldChange(
											"objective",
											"temperature",
											event.target.value,
										)
									}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="physicalExamination">{tSession("soapOffline.fields.physicalExamination")} *</Label>
							<Textarea
								id="physicalExamination"
								value={draft.Objective.physicalExamination}
								onChange={(event) =>
									onSectionFieldChange(
										"objective",
										"physicalExamination",
										event.target.value,
									)
								}
								rows={3}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="diagnosticResults">{tSession("soapOffline.fields.diagnosticResults")}</Label>
							<Textarea
								id="diagnosticResults"
								value={draft.Objective.diagnosticResults}
								onChange={(event) =>
									onSectionFieldChange(
										"objective",
										"diagnosticResults",
										event.target.value,
									)
								}
								rows={3}
								disabled={isSubmitting}
							/>
						</div>
					</div>
				)}

				{activeTab === "assessment" && (
					<div className="space-y-3 rounded-lg border p-4">
						<div className="space-y-2">
							<Label htmlFor="diagnosisType">{tSession("soapOffline.fields.diagnosisType")}</Label>
							<Input
								id="diagnosisType"
								value={draft.Assessment.diagnosisType}
								onChange={(event) =>
									onSectionFieldChange(
										"assessment",
										"diagnosisType",
										event.target.value,
									)
								}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="condition">{tSession("soapOffline.fields.condition")} *</Label>
							<Input
								id="condition"
								value={draft.Assessment.condition}
								onChange={(event) =>
									onSectionFieldChange(
										"assessment",
										"condition",
										event.target.value,
									)
								}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="icd10Code">{tSession("soapOffline.fields.icd10Code")}</Label>
							<Input
								id="icd10Code"
								value={draft.Assessment.icd10Code}
								onChange={(event) =>
									onSectionFieldChange(
										"assessment",
										"icd10Code",
										event.target.value,
									)
								}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">{tSession("soapOffline.fields.status")}</Label>
							<Input
								id="status"
								value={draft.Assessment.status}
								onChange={(event) =>
									onSectionFieldChange(
										"assessment",
										"status",
										event.target.value,
									)
								}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="rationale">{tSession("soapOffline.fields.rationale")}</Label>
							<Textarea
								id="rationale"
								value={draft.Assessment.rationale}
								onChange={(event) =>
									onSectionFieldChange(
										"assessment",
										"rationale",
										event.target.value,
									)
								}
								rows={3}
								disabled={isSubmitting}
							/>
						</div>
					</div>
				)}

				{activeTab === "plan" && (
					<div className="space-y-3 rounded-lg border p-4">
						{draft.Plan.medications.map((medication, index) => (
							<div key={`medication-${index}`} className="space-y-3 rounded-md border p-3">
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium">
										{tSession("soapOffline.actions.medication")}
										 {index + 1}
									</p>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => onRemoveMedication(index)}
										disabled={isSubmitting}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="space-y-2">
									<Label htmlFor={`medicationName-${index}`}>{tSession("soapOffline.fields.medicationName")} *</Label>
									<Input
										id={`medicationName-${index}`}
										value={medication.name}
										onChange={(event) =>
											onSectionFieldChange("plan", "name", event.target.value, index)
										}
										disabled={isSubmitting}
									/>
								</div>

								<div className="grid gap-3 md:grid-cols-3">
									<div className="space-y-2">
										<Label htmlFor={`dosage-${index}`}>{tSession("soapOffline.fields.dosage")}</Label>
										<Input
											id={`dosage-${index}`}
											value={medication.dosage}
											onChange={(event) =>
												onSectionFieldChange("plan", "dosage", event.target.value, index)
											}
											disabled={isSubmitting}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`frequency-${index}`}>{tSession("soapOffline.fields.frequency")}</Label>
										<Input
											id={`frequency-${index}`}
											value={medication.frequency}
											onChange={(event) =>
												onSectionFieldChange("plan", "frequency", event.target.value, index)
											}
											disabled={isSubmitting}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor={`duration-${index}`}>{tSession("soapOffline.fields.durationMedication")}</Label>
										<Input
											id={`duration-${index}`}
											value={medication.duration}
											onChange={(event) =>
												onSectionFieldChange("plan", "duration", event.target.value, index)
											}
											disabled={isSubmitting}
										/>
									</div>
								</div>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							onClick={onAddMedication}
							disabled={isSubmitting}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							{tSession("soapOffline.actions.addMedication")}
						</Button>

						<div className="space-y-2">
							<Label htmlFor="activity">{tSession("soapOffline.fields.activityInstructions")}</Label>
							<Textarea
								id="activity"
								value={draft.Plan.inistructions.activity}
								onChange={(event) =>
									onSectionFieldChange("plan", "activity", event.target.value)
								}
								rows={3}
								disabled={isSubmitting}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="followUp">{tSession("soapOffline.fields.followUp")} *</Label>
							<Input
								id="followUp"
								value={draft.Plan.inistructions.followUp}
								onChange={(event) =>
									onSectionFieldChange("plan", "followUp", event.target.value)
								}
								disabled={isSubmitting}
							/>
						</div>
					</div>
				)}

				<div className="flex flex-wrap justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={onReset}
						disabled={isSubmitting}
					>
						{tSession("soapOffline.actions.reset")}
					</Button>
					<Button
						type="button"
						onClick={() => setShowSaveDialog(true)}
						disabled={isSubmitting || isLoadingContext || !isFormValid}
						className="gap-2"
					>
						{(isSubmitting || isLoadingContext) && (
							<Loader2 className="h-4 w-4 animate-spin" />
						)}
						<Save className="h-4 w-4" />
						{tSession("soapOffline.actions.save")}
					</Button>
				</div>

				<Dialog
					open={showSaveDialog}
					onOpenChange={(open) => {
						if (!isSubmitting && !isLoadingContext) {
							setShowSaveDialog(open);
						}
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>
								{tSession("soapOffline.confirmSave.title")}
							</DialogTitle>
							<DialogDescription>
								{tSession("soapOffline.confirmSave.description")}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="flex-row gap-2">
							<Button
								variant="outline"
								onClick={() => setShowSaveDialog(false)}
								disabled={isSubmitting || isLoadingContext}
								className="flex-1"
							>
								{tCommon("cancel")}
							</Button>
							<Button
								onClick={() => void handleConfirmSave()}
								disabled={isSubmitting || isLoadingContext}
								className="flex-1 gap-2"
							>
								{(isSubmitting || isLoadingContext) && (
									<Loader2 className="h-4 w-4 animate-spin" />
								)}
								{tSession("soapOffline.confirmSave.confirm")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}


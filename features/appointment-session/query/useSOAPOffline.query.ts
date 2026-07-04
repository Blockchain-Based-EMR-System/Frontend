import { useMutation } from "@tanstack/react-query";
import {
	getDoctorAppointmentContext,
	submitSoapOfflineRecord,
} from "../api/SOAPOffline.api";
import { SubmitSoapOfflineInput } from "../types/SOAPOffline.types";

export const useDoctorAppointmentContext = () => {
	return useMutation({
		mutationFn: (appointmentId: string) => getDoctorAppointmentContext(appointmentId),
	});
};

export const useSubmitSoapOfflineRecord = () => {
	return useMutation({
		mutationFn: ({
			clinicId,
			patientId,
			payload,
		}: SubmitSoapOfflineInput) =>
			submitSoapOfflineRecord({
				clinicId,
				patientId,
				payload,
			}),
	});
};

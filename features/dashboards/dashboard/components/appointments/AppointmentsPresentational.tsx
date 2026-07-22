"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarCheck } from "lucide-react";
import { AppointmentsPresentationalProps } from "./AppointmentsContainer";
import { AppointmentCard } from "./AppointmentCard";
import { CancelAppointmentModal } from "./CancelAppointmentModal";
import { RescheduleAppointmentModal } from "./RescheduleAppointmentModal";
import { Appointment } from "../../types/dashboardTypes";
import Link from "next/link";
import { AppointmentsListSkeleton } from "../skeletons";

export function AppointmentsPresentational({
  upcomingAppointments,
  pastAppointments,
  isLoading,
  isError,
  activeView,
  setActiveView,
  tDashboard,
  tCommon,
}: AppointmentsPresentationalProps) {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelModalOpen(true);
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setCancelModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleRescheduleModalClose = () => {
    setRescheduleModalOpen(false);
    setSelectedAppointment(null);
  };

  if (isLoading) {
    return <AppointmentsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">
              {tCommon("error")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const appointments =
    activeView === "upcoming" ? upcomingAppointments : pastAppointments;
  const noAppointmentsMessage =
    activeView === "upcoming"
      ? tDashboard("noUpcomingAppointments")
      : tDashboard("noPastAppointments");
  const noAppointmentsDesc =
    activeView === "upcoming"
      ? tDashboard("noUpcomingAppointmentsDesc")
      : tDashboard("noPastAppointmentsDesc");

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-lg border bg-muted p-1">
            <Button
              variant={activeView === "upcoming" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("upcoming")}
              className="rounded-md"
            >
              <CalendarCheck className="h-4 w-4 mr-2" />
              {tDashboard("upcoming")}
            </Button>
            <Button
              variant={activeView === "history" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("history")}
              className="rounded-md"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {tDashboard("history")}
            </Button>
          </div>
        </div>

        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">{noAppointmentsMessage}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {noAppointmentsDesc}
              </p>
              {activeView === "upcoming" && (
                <Button asChild className="mt-4">
                  <Link href="/clinics">{tDashboard("bookAppointment")}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isPast={activeView === "history"}
                onCancel={
                  activeView === "upcoming" ? handleCancelClick : undefined
                }
                onReschedule={
                  activeView === "upcoming" ? handleRescheduleClick : undefined
                }
                tDashboard={tDashboard}
                tCommon={tCommon}
              />
            ))}
          </div>
        )}
      </div>

      {selectedAppointmentId && (
        <CancelAppointmentModal
          isOpen={cancelModalOpen}
          onClose={handleCancelModalClose}
          appointmentId={selectedAppointmentId}
          tDashboard={tDashboard}
          tCommon={tCommon}
        />
      )}

      {selectedAppointment && (
        <RescheduleAppointmentModal
          isOpen={rescheduleModalOpen}
          onClose={handleRescheduleModalClose}
          appointment={selectedAppointment}
          tDashboard={tDashboard}
          tCommon={tCommon}
        />
      )}
    </>
  );
}

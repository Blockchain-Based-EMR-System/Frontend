"use client";

import { ArrowLeft, Lock } from "lucide-react";
import { SoapReviewPresentationalProps } from "./SoapReviewContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SoapReviewPresentational({
  hasDraft,
  subjective,
  objective,
  assessment,
  plan,
  onFieldChange,
  onBack,
  onConfirm,
  tSession,
}: SoapReviewPresentationalProps) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        {tSession("backToAppointments")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{tSession("soap.reviewTitle")}</CardTitle>
          <CardDescription>
            {tSession("soap.reviewDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasDraft && (
            <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              {tSession("soap.noDraft")}
            </div>
          )}

          <div className="space-y-2">
            <Label>{tSession("soap.subjective")}</Label>
            <Textarea
              value={subjective}
              onChange={(e) => onFieldChange("subjective", e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>{tSession("soap.objective")}</Label>
            <Textarea
              value={objective}
              onChange={(e) => onFieldChange("objective", e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>{tSession("soap.assessment")}</Label>
            <Textarea
              value={assessment}
              onChange={(e) => onFieldChange("assessment", e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>{tSession("soap.plan")}</Label>
            <Textarea
              value={plan}
              onChange={(e) => onFieldChange("plan", e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={onConfirm} className="gap-2">
            {tSession("soap.confirm")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

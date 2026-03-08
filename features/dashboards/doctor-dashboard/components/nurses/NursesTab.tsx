    "use client";

    import { useState } from "react";
    import { useTranslations } from "next-intl";
    import { Eye, UserRound } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent } from "@/components/ui/card";
    import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Badge } from "@/components/ui/badge";
    import { DoctorNurse } from "../../types/nurse.types";
    import { NurseDetailDialog } from "./NurseDetailDialog";
    import { NursesTabSkeleton } from "../skeletons/NursesTabSkeleton";
    import { useDoctorNurses } from "../../query/useNurses.query";
    import { getInitials, getTimeIn12HourFormat } from "@/lib/helpers";
    import { useLanguage } from "@/contexts/LanguageProvider";


    interface NursesTabPresentationalProps {
    nurses: DoctorNurse[];
    isLoading: boolean;
    onViewNurse: (nurse: DoctorNurse) => void;
    }

    function NursesTabPresentational({
    nurses,
    isLoading,
    onViewNurse,
    }: NursesTabPresentationalProps) {
    const t = useTranslations("doctorDashboard.nurses");
    const tFields = useTranslations("fields");
    const tSchedule = useTranslations("doctorDashboard.schedule");
    const tCommon = useTranslations("common");
    const { locale } = useLanguage();

    if (isLoading) {
        return <NursesTabSkeleton />;
    }

    const emptyState = (
        <div className="flex flex-col items-center gap-3 py-12">
        <UserRound className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{t("noNurses")}</p>
        </div>
    );

    return (
        <div className="space-y-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
            <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card className="hidden md:block">
            <CardContent className="p-0">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>{tFields("name")}</TableHead>
                    <TableHead>{t("age")}</TableHead>
                    <TableHead>{tFields("gender")}</TableHead>
                    <TableHead colSpan={2}>{t("clinics")} / {t("workingDays")}</TableHead>
                    <TableHead className="text-end">{tCommon("actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {nurses.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                        {emptyState}
                        </TableCell>
                    </TableRow>
                    ) : (
                    nurses.map((nurse) => (
                        <TableRow key={nurse.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage
                                src={nurse.profilePic ?? undefined}
                                alt={nurse.name}
                                />
                                <AvatarFallback>
                                <p className="text-primary">
                                    {getInitials(nurse.name)}
                                </p>
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{nurse.name}</span>
                            </div>
                        </TableCell>

                        <TableCell>{nurse.age}</TableCell>

                        <TableCell>
                            {nurse.gender === "MALE"
                            ? tFields("male")
                            : nurse.gender === "FEMALE"
                                ? tFields("female")
                                : "N/A"}
                        </TableCell>

                        <TableCell colSpan={2}>
                            {nurse.clinics.length === 0 ? (
                            <span className="text-muted-foreground text-sm">—</span>
                            ) : (
                            <div className="flex flex-col gap-2">
                                {nurse.clinics.map((clinic) => (
                                <div
                                    key={clinic.id}
                                    className="flex items-start gap-4 py-1.5 first:pt-0 last:pb-0"
                                >
                                    <div className="w-32 shrink-0 pt-0.5">
                                    <Badge variant="secondary" className="text-xs">
                                        {clinic.name}
                                    </Badge>
                                    </div>

                                    {clinic.working_days.length === 0 ? (
                                    <span className="text-muted-foreground text-sm">—</span>
                                    ) : (
                                    <div className="flex flex-col gap-1">
                                        {clinic.working_days.map((wd, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center text-xs text-muted-foreground"
                                        >
                                            <span
                                            className={`font-bold text-primary ${
                                                locale === "ar" ? "ml-2" : "mr-2"
                                            }`}
                                            >
                                            {tSchedule(
                                                `daysShort.${wd.day_of_week.toLowerCase()}`,
                                            )}
                                            </span>
                                            {getTimeIn12HourFormat(wd.start_time, locale)}
                                            –
                                            {getTimeIn12HourFormat(wd.end_time, locale)}
                                        </span>
                                        ))}
                                    </div>
                                    )}
                                </div>
                                ))}
                            </div>
                            )}
                        </TableCell>

                        <TableCell className="text-end">
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewNurse(nurse)}
                            className="gap-2"
                            >
                            <Eye className="h-4 w-4" />
                            {t("viewMore")}
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>

        <div className="flex flex-col gap-3 md:hidden">
            {nurses.length === 0 ? (
            <Card>
                <CardContent className="p-4">{emptyState}</CardContent>
            </Card>
            ) : (
            nurses.map((nurse) => (
                <Card key={nurse.id}>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                            src={nurse.profilePic ?? undefined}
                            alt={nurse.name}
                        />
                        <AvatarFallback>
                            <p className="text-primary">{getInitials(nurse.name)}</p>
                        </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold truncate">{nurse.name}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewNurse(nurse)}
                        className="gap-1.5 shrink-0"
                    >
                        <Eye className="h-4 w-4" />
                        {t("viewMore")}
                    </Button>
                    </div>

                    <div className="flex gap-4 text-sm">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">
                        {t("age")}
                        </span>
                        <span className="font-medium">{nurse.age}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">
                        {tFields("gender")}
                        </span>
                        <span className="font-medium">
                        {nurse.gender === "MALE"
                            ? tFields("male")
                            : nurse.gender === "FEMALE"
                            ? tFields("female")
                            : "N/A"}
                        </span>
                    </div>
                    </div>

                    {nurse.clinics.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {t("clinics")}
                        </p>
                        <div className="space-y-2">
                        {nurse.clinics.map((clinic) => (
                            <div key={clinic.id} className="space-y-1">
                            <Badge variant="secondary" className="text-xs">
                                {clinic.name}
                            </Badge>

                            {clinic.working_days.length > 0 && (
                                <div className="flex flex-col gap-1 ps-2 border-s-2 border-primary/30">
                                {clinic.working_days.map((wd, idx) => (
                                    <span
                                    key={idx}
                                    className="inline-flex items-center text-xs text-muted-foreground"
                                    >
                                    <span
                                        className={`font-bold text-primary ${
                                        locale === "ar" ? "ml-2" : "mr-2"
                                        }`}
                                    >
                                        {tSchedule(
                                        `daysShort.${wd.day_of_week.toLowerCase()}`,
                                        )}
                                    </span>
                                    {getTimeIn12HourFormat(wd.start_time, locale)}
                                    –
                                    {getTimeIn12HourFormat(wd.end_time, locale)}
                                    </span>
                                ))}
                                </div>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                </CardContent>
                </Card>
            ))
            )}
        </div>
        </div>
    );
    }


    export function NursesTab() {
    const { data, isLoading } = useDoctorNurses();
    const [selectedNurse, setSelectedNurse] = useState<DoctorNurse | null>(null);

    const nurses = data?.data ?? [];

    return (
        <>
        <NursesTabPresentational
            nurses={nurses}
            isLoading={isLoading}
            onViewNurse={setSelectedNurse}
        />
        {selectedNurse && (
            <NurseDetailDialog
            nurse={selectedNurse}
            open={!!selectedNurse}
            onClose={() => setSelectedNurse(null)}
            />
        )}
        </>
    );
    }
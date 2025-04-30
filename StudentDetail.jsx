// src/components/students/StudentDetail.jsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

export default function StudentDetail({ student, onBack, onEdit }) {
  const t = useTranslations("students");
  const tCommon = useTranslations("common");

  if (!student) return null;

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 rtl:ml-2 rtl:mr-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-16 w-16">
              {/* Placeholder for photo - replace with actual image if photoUrl exists */}
              <AvatarImage src={student.photoUrl || "/placeholder-avatar.png"} alt={`${student.firstName} ${student.lastName}`} />
              <AvatarFallback>{getInitials(student.firstName, student.lastName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{`${student.firstName} ${student.lastName}`}</CardTitle>
              <CardDescription>{t("idNumber")}: {student.idNumber || "N/A"}</CardDescription>
            </div>
          </div>
          <Button onClick={() => onEdit(student)}>{tCommon("edit")}</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold">{t("fatherName")}:</span> {student.fatherName || "N/A"}</div>
          <div><span className="font-semibold">{t("guardian")}:</span> {student.guardian || "N/A"}</div>
          <div><span className="font-semibold">{t("phone")}:</span> {student.phone || "N/A"}</div>
          <div><span className="font-semibold">{t("class")}:</span> {student.class?.className || "N/A"}</div>
          <div><span className="font-semibold">{t("socialStatus")}:</span> {student.socialStatus || "N/A"}</div>
          <div><span className="font-semibold">{t("academicStatus")}:</span> {student.academicStatus || "N/A"}</div>
          <div><span className="font-semibold">{t("behavior")}:</span> {student.behavior || "N/A"}</div>
          <div><span className="font-semibold">{t("healthStatus")}:</span> {student.healthStatus || "N/A"}</div>
        </div>
        <div>
          <h4 className="font-semibold mb-1">{t("notes")}:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{student.notes || "N/A"}</p>
        </div>
        {/* Add more details or sections as needed */}
      </CardContent>
    </Card>
  );
}


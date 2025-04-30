// src/components/classes/ClassDetail.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";

export default function ClassDetail({ classId, onBack, onEdit }) {
  const t = useTranslations("classes");
  const tStudents = useTranslations("students");
  const tCommon = useTranslations("common");
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allStudents, setAllStudents] = useState([]); // For adding students
  const [selectedStudentToAdd, setSelectedStudentToAdd] = useState("");

  // Fetch class details
  useEffect(() => {
    if (!classId) return;
    const fetchClassDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/classes/${classId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }
        const result = await response.json();
        setClassData(result.data || null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || tCommon("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };
    fetchClassDetails();
  }, [classId]);

  // Fetch all students (potential students to add)
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await fetch("/api/students"); // Assuming this fetches all students
        if (!response.ok) {
          throw new Error("Failed to fetch students list");
        }
        const result = await response.json();
        setAllStudents(result.data || []);
      } catch (err) {
        console.error("Error fetching all students:", err);
        // Non-critical error, maybe just log it
      }
    };
    fetchAllStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!selectedStudentToAdd || !classData) return;

    try {
      const response = await fetch(`/api/classes/${classData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentsToAdd: [selectedStudentToAdd] }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to add student");
      }
      setClassData(result.data); // Update class data with new student list
      setSelectedStudentToAdd("");
      toast.success(t("studentAddedToClassSuccess")); // Add key
    } catch (err) {
      console.error("Error adding student to class:", err);
      toast.error(err.message || tCommon("errors.somethingWentWrong"));
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!studentId || !classData) return;

    try {
      const response = await fetch(`/api/classes/${classData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentsToRemove: [studentId] }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to remove student");
      }
      setClassData(result.data); // Update class data
      toast.success(t("studentRemovedFromClassSuccess")); // Add key
    } catch (err) {
      console.error("Error removing student from class:", err);
      toast.error(err.message || tCommon("errors.somethingWentWrong"));
    }
  };

  // Students available to be added (not already in the class)
  const availableStudentsToAdd = allStudents.filter(
    student => !classData?.students.some(cs => cs._id === student._id)
  );

  if (loading) return <div>{tCommon("loading")}...</div>;
  if (error) return <div>{tCommon("errors.error")}: {error}</div>;
  if (!classData) return <div>{t("classNotFound")}</div>; // Add key

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 rtl:ml-2 rtl:mr-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <CardTitle className="text-2xl">{classData.className}</CardTitle>
            <CardDescription>{t("teacher")}: {classData.teacher?.username || "N/A"}</CardDescription>
            {classData.description && <CardDescription>{classData.description}</CardDescription>}
          </div>
          <Button onClick={() => onEdit(classData)}>{tCommon("edit")}</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t("students")} ({classData.students?.length || 0})</h3>
          
          {/* Add Student Section */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4 p-4 border rounded-md bg-muted/40">
            <Select value={selectedStudentToAdd} onValueChange={setSelectedStudentToAdd}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("selectStudentToAddPlaceholder")} /> {/* Add key */}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>{t("selectStudentToAddPlaceholder")}</SelectItem>
                {availableStudentsToAdd.map(student => (
                  <SelectItem key={student._id} value={student._id}>
                    {`${student.firstName} ${student.lastName} (${student.idNumber || "."})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddStudent} disabled={!selectedStudentToAdd} size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>

          {/* Student List Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tStudents("firstName")}</TableHead>
                  <TableHead>{tStudents("lastName")}</TableHead>
                  <TableHead>{tStudents("idNumber")}</TableHead>
                  <TableHead className="text-right">{tCommon("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData.students && classData.students.length > 0 ? (
                  classData.students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell>{student.idNumber || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleRemoveStudent(student._id)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {t("noStudentsInClass")}. {/* Add key */}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


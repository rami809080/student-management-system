// src/components/students/StudentList.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog"; // Assuming a reusable confirmation dialog

export default function StudentList({ onEdit, onView, onAdd }) {
  const t = useTranslations("students");
  const tCommon = useTranslations("common");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const result = await response.json();
        setStudents(result.data || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || tCommon("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/students/${studentToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete student");
      }

      toast.success(t("studentDeleted"));
      setStudents(students.filter(s => s._id !== studentToDelete._id)); // Update state
      setStudentToDelete(null);
      setShowDeleteConfirm(false);

    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.message || tCommon("errors.somethingWentWrong"));
      setStudentToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(student => 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.idNumber && student.idNumber.includes(searchTerm))
    );
  }, [students, searchTerm]);

  if (loading) return <div>{tCommon("loading")}...</div>; // Add loading key
  if (error) return <div>{tCommon("errors.error")}: {error}</div>; // Add error key

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <Button onClick={onAdd}>{t("addStudent")}</Button>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
         <Input 
            placeholder={tCommon("search") + "..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
         />
         {/* Add Filter Button/Dropdown Here if needed */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("firstName")}</TableHead>
              <TableHead>{t("lastName")}</TableHead>
              <TableHead>{t("idNumber")}</TableHead>
              <TableHead>{t("class")}</TableHead>
              <TableHead className="text-right">{tCommon("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.idNumber || "-"}</TableCell>
                  <TableCell>{student.class?.className || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{tCommon("openMenu")}</span> {/* Add openMenu key */}
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(student)}>
                          {tCommon("view")} {/* Add view key */}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(student)}>
                          {tCommon("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(student)}
                          className="text-red-600 focus:text-red-700 focus:bg-red-100"
                        >
                          {tCommon("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noStudents")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title={t("confirmDeleteStudent")}
          description={tCommon("confirmDeleteAction")} // Add confirmDeleteAction key
          confirmText={tCommon("delete")}
          cancelText={tCommon("cancel")}
        />
      )}
    </div>
  );
}


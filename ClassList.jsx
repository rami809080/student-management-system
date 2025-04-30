// src/components/classes/ClassList.jsx
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

export default function ClassList({ onEdit, onView, onAdd }) {
  const t = useTranslations("classes");
  const tCommon = useTranslations("common");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/classes");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const result = await response.json();
        setClasses(result.data || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || tCommon("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleDeleteClick = (classItem) => {
    setClassToDelete(classItem);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;

    try {
      const response = await fetch(`/api/classes/${classToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete class");
      }

      toast.success(t("classDeleted"));
      setClasses(classes.filter(c => c._id !== classToDelete._id)); // Update state
      setClassToDelete(null);
      setShowDeleteConfirm(false);

    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error(error.message || tCommon("errors.somethingWentWrong"));
      setClassToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!searchTerm) return classes;
    return classes.filter(classItem => 
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.teacher?.username && classItem.teacher.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [classes, searchTerm]);

  if (loading) return <div>{tCommon("loading")}...</div>;
  if (error) return <div>{tCommon("errors.error")}: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("title")}</h2>
        <Button onClick={onAdd}>{t("addClass")}</Button>
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
              <TableHead>{t("className")}</TableHead>
              <TableHead>{t("teacher")}</TableHead>
              <TableHead>{t("students")}</TableHead>
              <TableHead className="text-right">{tCommon("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <TableRow key={classItem._id}>
                  <TableCell>{classItem.className}</TableCell>
                  <TableCell>{classItem.teacher?.username || "-"}</TableCell>
                  <TableCell>{classItem.students?.length || 0}</TableCell> {/* Display student count */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{tCommon("openMenu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(classItem)}>
                          {tCommon("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(classItem)}>
                          {tCommon("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(classItem)}
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
                <TableCell colSpan={4} className="h-24 text-center">
                  {t("noClasses")}
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
          title={t("confirmDeleteClass")}
          description={tCommon("confirmDeleteAction")} 
          confirmText={tCommon("delete")}
          cancelText={tCommon("cancel")}
        />
      )}
    </div>
  );
}


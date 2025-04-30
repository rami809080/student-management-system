// src/components/classes/ClassForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming Select component exists
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Define Zod schema based on the Mongoose model
const classSchema = z.object({
  className: z.string().min(1, { message: "classNameRequired" }), // Add classNameRequired key
  description: z.string().optional(),
  teacher: z.string().optional(), // Store teacher ID as string
});

export default function ClassForm({ classData, onSave, onCancel }) {
  const t = useTranslations("classes");
  const tCommon = useTranslations("common");
  const tUsers = useTranslations("users"); // For teacher list
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState([]);

  const form = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      className: classData?.className || "",
      description: classData?.description || "",
      teacher: classData?.teacher?._id || "", // Use teacher ID
    },
  });

  // Fetch teachers for the dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // TODO: Replace with an actual API endpoint to fetch users with 'teacher' role
        // For now, using a placeholder or assuming an endpoint exists
        // const response = await fetch("/api/users?role=teacher"); 
        // if (!response.ok) throw new Error("Failed to fetch teachers");
        // const result = await response.json();
        // setTeachers(result.data || []);
        console.warn("Teacher fetching not implemented yet. Using placeholder.");
        // Placeholder:
        setTeachers([{ _id: "teacher1", username: "Teacher One" }, { _id: "teacher2", username: "Teacher Two" }]);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Failed to load teachers list");
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    form.reset({
      className: classData?.className || "",
      description: classData?.description || "",
      teacher: classData?.teacher?._id || "",
    });
  }, [classData, form.reset]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const url = classData ? `/api/classes/${classData._id}` : "/api/classes";
      const method = classData ? "PUT" : "POST";

      // Ensure teacher ID is null if empty string is selected
      const payload = {
        ...values,
        teacher: values.teacher || null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save class");
      }

      toast.success(classData ? t("classUpdated") : t("classAdded"));
      onSave(result.data); // Pass the saved/updated class data back
      form.reset(); // Reset form after successful save

    } catch (error) {
      console.error("Error saving class:", error);
      let errorMessage = error.message;
      if (errorMessage === "Class with this name already exists") {
          errorMessage = t("classNameExistsError") || errorMessage; // Add this key
      }
      toast.error(errorMessage || tCommon("errors.somethingWentWrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("className")}</FormLabel>
              <FormControl>
                <Input placeholder={t("className")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("description")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("teacher")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectTeacherPlaceholder")} /> {/* Add key */}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">{t("noTeacherAssigned")}</SelectItem> {/* Add key */}
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tCommon("saving") + "..." : tCommon("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}


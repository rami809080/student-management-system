// src/components/students/StudentForm.jsx
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
import { useTranslations } from "next-intl";
import { toast } from "sonner"; // Assuming sonner for notifications

// Define Zod schema based on the Mongoose model and requirements
const studentSchema = z.object({
  firstName: z.string().min(1, { message: "firstNameRequired" }),
  fatherName: z.string().optional(),
  lastName: z.string().min(1, { message: "lastNameRequired" }),
  guardian: z.string().optional(),
  phone: z.string().optional(),
  idNumber: z.string().optional(),
  // photoUrl: z.string().url().optional(), // Add validation if needed
  socialStatus: z.string().optional(),
  academicStatus: z.string().optional(),
  behavior: z.string().optional(),
  healthStatus: z.string().optional(),
  notes: z.string().optional(),
  // class: z.string().optional(), // Handle class assignment separately if needed
});

export default function StudentForm({ student, onSave, onCancel }) {
  const t = useTranslations("students");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth"); // For error messages
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      firstName: "",
      fatherName: "",
      lastName: "",
      guardian: "",
      phone: "",
      idNumber: "",
      // photoUrl: "",
      socialStatus: "",
      academicStatus: "",
      behavior: "",
      healthStatus: "",
      notes: "",
      // class: "",
    },
  });

  useEffect(() => {
    // Reset form if student data changes (e.g., when switching to edit mode)
    form.reset(student || {
        firstName: "",
        fatherName: "",
        lastName: "",
        guardian: "",
        phone: "",
        idNumber: "",
        socialStatus: "",
        academicStatus: "",
        behavior: "",
        healthStatus: "",
        notes: "",
    });
  }, [student, form.reset]);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const url = student ? `/api/students/${student._id}` : "/api/students";
      const method = student ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save student");
      }

      toast.success(student ? t("studentUpdated") : t("studentAdded"));
      onSave(result.data); // Pass the saved/updated student data back
      form.reset(); // Reset form after successful save

    } catch (error) {
      console.error("Error saving student:", error);
      // Attempt to translate known error messages
      let errorMessage = error.message;
      if (errorMessage === "Student with this ID number already exists") {
          errorMessage = t("idNumberExistsError") || errorMessage; // Add this key to JSON files
      }
      toast.error(errorMessage || tCommon("errors.somethingWentWrong"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("firstName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("lastName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fatherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fatherName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("fatherName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guardian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("guardian")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("guardian")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phone")}</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t("phone")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("idNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("idNumber")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add Photo Upload Field Here - Requires more setup (e.g., Cloudinary, S3) */}
          {/* <FormField ... name="photoUrl" ... /> */}
          <FormField
            control={form.control}
            name="socialStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("socialStatus")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("socialStatus")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="academicStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("academicStatus")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("academicStatus")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="behavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("behavior")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("behavior")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("healthStatus")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("healthStatus")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("notes")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tCommon("saving") + "..." : tCommon("save")} {/* Add saving key */}
          </Button>
        </div>
      </form>
    </Form>
  );
}


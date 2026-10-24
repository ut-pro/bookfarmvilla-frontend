"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitReferral } from "@/lib/public-api";
import type { ReferralSubmissionData } from "@/types/referral";

interface ReferralFormProps {
  onSuccess?: () => void;
}

export default function ReferralForm({ onSuccess }: ReferralFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralSubmissionData>();

  const onSubmit = async (data: ReferralSubmissionData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitReferral(data);
      if (response.success) {
        setSubmitSuccess(true);
        reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setSubmitError(response.message || "Failed to submit referral. Please try again.");
      }
    } catch (error) {
      setSubmitError("An error occurred while submitting your referral. Please try again later.");
      console.error("Referral submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#2EAD45]">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-bold text-[#0F172A]">Thank You for Your Referral!</h3>
        <p className="mt-2 text-sm text-gray-600">
          We have received your referral details. Our team will get in touch with your friend shortly.
          Once their booking is confirmed, we'll reach out to reward you!
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2EAD45] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
        >
          Refer Another Friend
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Referrer Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Your Information (Referrer)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="referrerName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="referrerName"
              {...register("referrerName", { required: "Your name is required" })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
                errors.referrerName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.referrerName && (
              <p className="mt-1 text-xs text-red-500">{errors.referrerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="referrerPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Your Phone Number *
            </label>
            <input
              type="tel"
              id="referrerPhone"
              {...register("referrerPhone", {
                required: "Your phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
                errors.referrerPhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="9876543210"
            />
            {errors.referrerPhone && (
              <p className="mt-1 text-xs text-red-500">{errors.referrerPhone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="referrerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email (Optional)
          </label>
          <input
            type="email"
            id="referrerEmail"
            {...register("referrerEmail", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
              errors.referrerEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="john@example.com"
          />
          {errors.referrerEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.referrerEmail.message}</p>
          )}
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Referee Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0F172A]">Friend's Information (Referee)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="refereeName" className="block text-sm font-medium text-gray-700 mb-1">
              Friend's Name *
            </label>
            <input
              type="text"
              id="refereeName"
              {...register("refereeName", { required: "Friend's name is required" })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
                errors.refereeName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Jane Smith"
            />
            {errors.refereeName && (
              <p className="mt-1 text-xs text-red-500">{errors.refereeName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="refereePhone" className="block text-sm font-medium text-gray-700 mb-1">
              Friend's Phone Number *
            </label>
            <input
              type="tel"
              id="refereePhone"
              {...register("refereePhone", {
                required: "Friend's phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
                errors.refereePhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="9876543210"
            />
            {errors.refereePhone && (
              <p className="mt-1 text-xs text-red-500">{errors.refereePhone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="refereeEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Friend's Email (Optional)
            </label>
            <input
              type="email"
              id="refereeEmail"
              {...register("refereeEmail", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] ${
                errors.refereeEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="jane@example.com"
            />
            {errors.refereeEmail && (
              <p className="mt-1 text-xs text-red-500">{errors.refereeEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
              Interested Venue Type (Optional)
            </label>
            <select
              id="propertyType"
              {...register("propertyType")}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45]"
            >
              <option value="">Select venue type</option>
              <option value="FARMHOUSE">Farmhouse</option>
              <option value="VILLA">Villa</option>
              <option value="WEDDING_LAWN">Wedding Lawn</option>
              <option value="AIRBNB">Holiday Home</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Event Date (Optional)
            </label>
            <input
              type="date"
              id="eventDate"
              {...register("eventDate")}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Message or Requirements (Optional)
          </label>
          <textarea
            id="message"
            rows={3}
            {...register("message")}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45]"
            placeholder="Tell us a bit about what they are looking for..."
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#2EAD45] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#1E8A32] disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Referral"}
        </button>
      </div>
    </form>
  );
}
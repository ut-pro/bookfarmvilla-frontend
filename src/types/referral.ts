export interface ReferralBannerData {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface ReferralStrategySectionData {
  title: string;
  subtitle: string;
  steps: ReferralStep[];
  benefits: ReferralBenefit[];
  ctaText: string;
  ctaHref: string;
}

export interface ReferralStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ReferralBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface ReferralSubmissionData {
  referrerName: string;
  referrerPhone: string;
  referrerEmail?: string;
  refereeName: string;
  refereePhone: string;
  refereeEmail?: string;
  propertyType?: "FARMHOUSE" | "VILLA" | "WEDDING_LAWN" | "AIRBNB";
  eventDate?: string;
  message?: string;
}

export interface ReferralSubmissionResponse {
  success: boolean;
  referralId?: string;
  message: string;
}

export interface ReferralPolicyData {
  title: string;
  sections: ReferralPolicySection[];
}

export interface ReferralPolicySection {
  heading: string;
  content: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  website?: string;
  linkedin?: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  id: string;
  name: string;
  motherTongue?: boolean;
  listening: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  reading: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  writing: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  spokenProduction: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  spokenInteraction: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  date: string;
  link?: string;
}

export type TemplateType = 'Official' | 'Modern' | 'Classic' | 'Creative' | 'Minimal' | 'Professional';
export type ColorTheme = 'blue' | 'green' | 'purple' | 'red' | 'turquoise' | 'orange' | 'navy';

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  achievements: string[];
  template: TemplateType;
  colorTheme: ColorTheme;
}

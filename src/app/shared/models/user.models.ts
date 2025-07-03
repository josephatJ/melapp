export interface UserGroup {
  id: string;
  name?: string;
}

export interface OrganisationUnit {
  id: string;
  name?: string;
}

export interface UserRole {
  id: string;
  name?: string;
}

export interface Settings {
  keyMessageSmsNotification: boolean;
  keyDbLocale: string;
  keyTrackerDashboardLayout: string;
  keyCurrentStyle: string;
  keyStyle: string;
  keyUiLocale: string;
  keyAnalysisDisplayProperty: string;
  keyMessageEmailNotification: boolean;
}

export interface Access {
  manage: boolean;
  externalize: boolean;
  write: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface UserInterface {
  id: string;
  username: string;
  surname: string;
  firstName: string;
  employer: string;
  languages: string;
  gender: string;
  jobTitle: string;
  created?: string;
  lastUpdated?: string;
  dataViewOrganisationUnits: any[];
  favorites?: any[];
  userGroups: UserGroup[];
  translations?: any[];
  teiSearchOrganisationUnits?: any[];
  organisationUnits: OrganisationUnit[];
  displayName: string;
  access?: Access;
  name: string;
  email: string;
  emailVerified?: boolean;
  introduction?: string;
  birthday?: string;
  nationality?: string;
  education?: string;
  interests?: string;
  whatsApp?: string;
  facebookMessenger?: string;
  skype?: string;
  telegram?: string;
  twitter?: string;
  userRoles?: UserRole[];
  settings?: Settings;
  programs?: string[];
  authorities?: string[];
  dataSets?: string[];
  patTokens?: any[];
  twoFactorType?: string;
  attributeValues?: any[];
  keyedAuthorities?: Record<string, string>;
}

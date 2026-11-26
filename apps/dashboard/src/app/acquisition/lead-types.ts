export type LeadContact = { name: string; role: string };

export type LeadCompany = {
  siren: string;
  name: string;
  city: string;
  postalCode: string;
  activityCode: string;
  employeeBand?: string;
  contacts: LeadContact[];
};

export type LeadCriteria = {
  query: string;
  department: string;
  activityCode: string;
  postalCode?: string;
  sector?: string;
  employeeBand?: string;
  directorName?: string;
};

export type LeadSearchResult = {
  companies: LeadCompany[];
  total: number;
  page: number;
  pages: number;
};

export type LeadList = {
  id: string;
  name: string;
  criteria: LeadCriteria;
  companies: LeadCompany[];
  createdAt: string;
};

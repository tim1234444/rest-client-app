export type ReplaceURLParams = {
  method?: string;
  url?: string;
  headers?: string;
  body?: string;
};
export type headersList = {
  key: string;
  value: string;
}[];
export type DataType = {
  url: string;
  method: string;
};
export type VariableItem = {
  varName: string;
  varValue: string;
};

export interface Team {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  gitHubUrl: string;
  contributions: string;
}

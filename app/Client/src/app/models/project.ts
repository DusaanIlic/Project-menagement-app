import { Member } from "./member";

export interface Project {
  id: number;
  projectName: string;
  endDate: Date;
  startDate: Date;
  description: string;
  details: string;
  status: string;
  lead: Member;
}

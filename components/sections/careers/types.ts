import type { Job } from "@/content/careers";

export type { Job };

export interface JobCardProps {
  job: Job;
}

export interface JobListProps {
  jobs: Job[];
}

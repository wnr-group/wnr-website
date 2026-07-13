import { JobCard } from "./JobCard";
import { ResumeDialog } from "./ResumeDialog";
import { noOpeningsCopy } from "@/content/careers";
import type { JobListProps } from "./types";

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-line-strong bg-mist px-6 py-16 text-center">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{noOpeningsCopy.heading}</p>
          <p className="mt-2 text-[0.95rem] text-body">{noOpeningsCopy.body}</p>
        </div>
        <ResumeDialog triggerLabel={noOpeningsCopy.ctaLabel} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="list" aria-label="Open roles" className="grid gap-5 sm:grid-cols-2">
        {jobs.map((job) => (
          <div role="listitem" key={job.id}>
            <JobCard job={job} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-line pt-8 text-center">
        <p className="text-sm text-muted">
          Don&rsquo;t see your role? We&rsquo;re always looking for exceptional talent.
        </p>
        <ResumeDialog triggerLabel="Submit Resume" />
      </div>
    </div>
  );
}

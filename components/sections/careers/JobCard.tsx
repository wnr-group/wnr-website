"use client";

import { ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import { Cta } from "@/components/ui/Cta";
import type { JobCardProps } from "./types";

export function JobCard({ job }: JobCardProps) {
  const applyHref = `/careers/apply?role=${encodeURIComponent(job.title)}`;

  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-line bg-paper p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-card">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{job.title}</h3>
        <p className="mt-1 text-sm text-muted">{job.department}</p>
      </div>

      <dl className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>{job.location}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={13} aria-hidden="true" />
          <dt className="sr-only">Employment type</dt>
          <dd>{job.employmentType}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} aria-hidden="true" />
          <dt className="sr-only">Experience</dt>
          <dd>{job.experience}</dd>
        </div>
      </dl>

      <p className="line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-body">{job.description}</p>

      <Cta href={applyHref} variant="ghost" className="w-fit" aria-label={`Apply for ${job.title}`}>
        Apply
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Cta>
    </article>
  );
}

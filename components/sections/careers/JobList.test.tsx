import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobList } from "./JobList";
import type { Job } from "./types";

const jobs: Job[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "WnR Systems",
    location: "Tamil Nadu / Remote",
    employmentType: "Full-time",
    experience: "4-7 years",
    description: "Own features end-to-end.",
  },
  {
    id: "operations-consultant",
    title: "Operations Consultant",
    department: "WnR Consulting",
    location: "Tamil Nadu",
    employmentType: "Full-time",
    experience: "3-5 years",
    description: "Map client workflows on-site.",
  },
];

describe("JobList", () => {
  it("renders a card per job plus a secondary submit-resume prompt", () => {
    render(<JobList jobs={jobs} />);
    expect(screen.getByText("Senior Full-Stack Engineer")).toBeInTheDocument();
    expect(screen.getByText("Operations Consultant")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /open roles/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Resume" })).toBeInTheDocument();
  });

  it("renders the no-openings fallback with a Submit Resume CTA when there are no jobs", () => {
    render(<JobList jobs={[]} />);
    expect(screen.getByText("No current openings.")).toBeInTheDocument();
    expect(screen.getByText(/always looking for exceptional talent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Resume" })).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobCard } from "./JobCard";
import type { Job } from "./types";

const job: Job = {
  id: "senior-fullstack-engineer",
  title: "Senior Full-Stack Engineer",
  department: "WnR Systems",
  location: "Remote / Hybrid",
  employmentType: "Full-time",
  experience: "4-7 years",
  description: "Own features end-to-end across our client platforms.",
};

describe("JobCard", () => {
  it("renders every required field", () => {
    render(<JobCard job={job} />);
    expect(screen.getByText("Senior Full-Stack Engineer")).toBeInTheDocument();
    expect(screen.getByText("WnR Systems")).toBeInTheDocument();
    expect(screen.getByText("Remote / Hybrid")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("4-7 years")).toBeInTheDocument();
    expect(screen.getByText(/own features end-to-end/i)).toBeInTheDocument();
  });

  it("links Apply to the contact page with a careers inquiry and the role name", () => {
    render(<JobCard job={job} />);
    const applyLink = screen.getByRole("link", { name: /apply for senior full-stack engineer/i });
    expect(applyLink).toHaveAttribute(
      "href",
      "/careers/apply?role=Senior%20Full-Stack%20Engineer",
    );
  });
});

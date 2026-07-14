import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ResumeDialog } from "./ResumeDialog";

describe("ResumeDialog", () => {
  it("opens the resume upload form from the trigger button", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog triggerLabel="Submit Resume" />);

    expect(screen.queryByText(/drag and drop your resume/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit Resume" }));

    expect(await screen.findByText(/drag and drop your resume/i)).toBeInTheDocument();
    expect(screen.getByText("Submit your resume")).toBeInTheDocument();
  });
});

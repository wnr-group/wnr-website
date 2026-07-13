import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog, DialogTrigger, DialogContent } from "./dialog";

describe("Dialog", () => {
  it("opens on trigger click, shows title/description/children, and closes", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent title="Submit your resume" description="We review every resume.">
          <p>Dialog body content</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText("Submit your resume")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByText("Submit your resume")).toBeInTheDocument();
    expect(screen.getByText("We review every resume.")).toBeInTheDocument();
    expect(screen.getByText("Dialog body content")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(screen.queryByText("Submit your resume")).not.toBeInTheDocument();
  });
});

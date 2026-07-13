import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ResumeUpload } from "./ResumeUpload";
import * as careersService from "@/services/careers";

function makeFile(name: string, size: number, type: string) {
  const file = new File([new Uint8Array(size)], name, { type });
  return file;
}

describe("ResumeUpload", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call uploadResume when an invalid file is selected", async () => {
    const spy = vi.spyOn(careersService, "uploadResume");
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.pdf", 1000, "application/pdf"));

    await waitFor(() => {
      expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    });

    // The Upload button should be enabled for a valid file
    const uploadBtn = screen.getByRole("button", { name: /upload resume/i });
    expect(uploadBtn).not.toBeDisabled();
    expect(spy).not.toHaveBeenCalled();
  });

  it("uploads a valid file, shows progress, and then a success panel", async () => {
    vi.spyOn(careersService, "uploadResume").mockImplementation(async (_file, options) => {
      options?.onProgress?.(40);
      options?.onProgress?.(100);
      return { ok: true, message: "Resume received." };
    });
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.pdf", 1000, "application/pdf"));

    await waitFor(() => {
      expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /upload resume/i }));

    await waitFor(() => {
      expect(screen.getByText("Resume received")).toBeInTheDocument();
    });
  });

  it("shows a server-reported error and lets the user remove the file", async () => {
    vi.spyOn(careersService, "uploadResume").mockResolvedValue({
      ok: false,
      kind: "server",
      message: "Something went wrong. Please try again.",
    });
    const user = userEvent.setup();
    render(<ResumeUpload />);

    const input = screen.getByLabelText(/browse for a resume file/i);
    await user.upload(input, makeFile("resume.pdf", 1000, "application/pdf"));
    await user.click(screen.getByRole("button", { name: /upload resume/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);
  });
});

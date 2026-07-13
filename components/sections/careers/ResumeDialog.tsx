"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ResumeUpload } from "./ResumeUpload";

export function ResumeDialog({ triggerLabel }: { triggerLabel: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:border-forest hover:bg-forest-wash/60 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
        <FileUp size={16} />
        {triggerLabel}
      </DialogTrigger>
      <DialogContent
        title="Submit your resume"
        description="Tell us where you'd fit. We review every resume against upcoming roles."
      >
        <ResumeUpload key={open ? "open" : "closed"} />
      </DialogContent>
    </Dialog>
  );
}

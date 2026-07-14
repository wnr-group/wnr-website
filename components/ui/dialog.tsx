"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
      <DialogPrimitive.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line bg-paper p-6 shadow-card-hover focus:outline-none sm:p-8",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogPrimitive.Title className="font-display text-xl font-bold text-ink">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-1.5 text-sm text-body">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <X size={16} />
          </DialogPrimitive.Close>
        </div>
        <div className="mt-6">{children}</div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

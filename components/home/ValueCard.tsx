import React from "react";
import { cn } from "@/lib/utils";
import { type WhyUsItem } from "@/data/why-us";

export interface ValueCardProps {
  item: WhyUsItem;
  isActive?: boolean;
  isGreen?: boolean;
  onClick?: () => void;
}

export const ValueCard = React.memo(function ValueCard({
  item,
  isActive = false,
  isGreen = false,
  onClick,
}: ValueCardProps) {
  const Icon = item.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex h-full w-full flex-col justify-between gap-6 rounded-3xl border p-7 sm:p-8 transition-colors duration-300 select-none",
        isGreen
          ? cn(
              "bg-forest text-white",
              isActive
                ? "border-white/30 shadow-card-hover cursor-default"
                : "border-white/10 shadow-card cursor-pointer hover:border-white/20"
            )
          : cn(
              "bg-paper text-ink",
              isActive
                ? "border-forest/25 shadow-card-hover cursor-default"
                : "border-line shadow-card cursor-pointer hover:border-forest/15"
            )
      )}
    >
      <div className="flex flex-col gap-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
            isGreen
              ? isActive
                ? "bg-white text-forest"
                : "bg-white/15 text-white"
              : isActive
                ? "bg-forest text-white"
                : "bg-forest-wash text-forest"
          )}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={1.75} />
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className={cn(
              "font-display text-xl font-semibold sm:text-2xl",
              isGreen ? "text-white" : "text-ink"
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              "text-[0.95rem] leading-relaxed sm:text-base",
              isGreen ? "text-white/85" : "text-body"
            )}
          >
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
});


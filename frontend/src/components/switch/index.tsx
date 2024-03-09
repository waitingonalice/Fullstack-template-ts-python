import { Switch as Component } from "@headlessui/react";
import clsx from "clsx";

interface SwitchProps {
  onToggle?: (enabled: boolean) => void;
  toggled: boolean;
  label?: string;
  size?: "sm" | "md";
}

export const Switch = ({
  toggled,
  onToggle,
  label,
  size = "md",
}: SwitchProps) => (
  <Component.Group>
    <div className="flex items-center">
      <Component.Label className="mr-4">{label}</Component.Label>
      <Component
        checked={toggled}
        onChange={onToggle}
        className={clsx(
          toggled ? "bg-primary-dark" : "bg-gray-300",
          size === "sm" ? "w-10 h-5" : "w-11 h-6",
          "relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2",
        )}
      >
        <span
          className={clsx(
            `inline-block bg-white transform rounded-full  transition-transform`,
            toggled ? "translate-x-6" : "translate-x-1",
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
          )}
        />
      </Component>
    </div>
  </Component.Group>
);

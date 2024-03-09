import { Transition } from "@headlessui/react";
import { Text } from "@waitingonalice/design-system/components/text";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";

export interface TooltipProps {
  title?: string;
  description?: string;
  targetElement?: React.RefObject<HTMLElement>["current"] | null;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  show?: boolean;
}

export const Tooltip = ({
  title,
  show,
  description,
  targetElement,
  position = "top",
  className,
}: TooltipProps) => {
  const tooltipRef = useRef(null);
  const positionMapper = {
    top: "top-0 transform -translate-y-full -translate-x-1/2 ml-2",
    bottom: "bottom-0 transform translate-y-full -translate-x-1/2 ml-2",
    left: "-left-2 top-1/2 transform -translate-x-full -translate-y-1/2",
    right: "-right-2 top-1/2 transform translate-x-full -translate-y-1/2",
  };

  useEffect(() => {
    targetElement?.style.setProperty("position", "relative");
  });

  return (
    <Transition
      ref={tooltipRef}
      show={show}
      enter="transition ease-in duration-50"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-out duration-50"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform opacity-0 scale-95"
      className={clsx("absolute z-50", positionMapper[position], className)}
    >
      <div
        role="tooltip"
        className={clsx(
          "bg-primary-main opacity-100 rounded-lg shadow-md py-2 px-3 text-start gap-x-2",
        )}
      >
        {title && (
          <Text type="body-bold" className="text-secondary-2">
            {title}
          </Text>
        )}
        <Text type="caption" className="text-secondary-2">
          {description}
        </Text>
      </div>
    </Transition>
  );
};

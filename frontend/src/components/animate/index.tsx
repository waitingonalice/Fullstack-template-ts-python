import { useLayoutEffect, useState } from "react";
import clsx from "clsx";

interface AnimateProps {
  duration?: number;
  enter?: string;
  enterFrom?: string;
  leaveTo?: string;
  children: React.ReactNode;
  show: boolean;
  className?: string;
}

export const Animate = ({
  duration,
  enter,
  enterFrom,
  leaveTo,
  children,
  show,
  className,
}: AnimateProps) => {
  const [showComponent, setShowComponent] = useState(false);
  const [animate, setAnimate] = useState<string>();

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      if (show) {
        setShowComponent(true);
        setAnimate(enterFrom);
      } else {
        setShowComponent(false);
        setAnimate(leaveTo);
      }
    }, duration || 100);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <div
      className={clsx(
        className,
        enter,
        animate,
        !showComponent ? "opacity-0" : "opacity-100",
      )}
    >
      {showComponent && children}
    </div>
  );
};

import { CodeBracketIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "@/components";
import { useHover } from "../hooks/useHover";

export const Language = () => {
  const { show, onHover, ref } = useHover();
  return (
    <>
      <div ref={ref}>
        <CodeBracketIcon
          className="w-5 h-auto text-secondary-4 hover:text-secondary-1 transition duration-300"
          onMouseEnter={() => onHover("in")}
          onMouseLeave={() => onHover("out")}
        />
        <Tooltip
          show={show}
          targetElement={ref.current}
          position="bottom"
          description="Typescript"
          className="pt-1"
        />
      </div>
    </>
  );
};

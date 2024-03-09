/* eslint-disable react/no-array-index-key */
import { forwardRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  PlayIcon,
} from "@heroicons/react/20/solid";
import { Switch } from "@waitingonalice/design-system/components/switch";
import { Text } from "@waitingonalice/design-system/components/text";
import { cn } from "@waitingonalice/design-system/utils/cn";
import { Dropdown, Tooltip } from "@/components";
// eslint-disable-next-line import/no-cycle
import { ConsoleType, Result, Status } from "../hooks/useEditor";
import { useHover } from "../hooks/useHover";

interface PreviewProps {
  children: React.ReactNode;
  className?: string;
}
export const Preview = forwardRef(
  ({ children, className }: PreviewProps, ref: React.Ref<HTMLPreElement>) => (
    <pre ref={ref} className={cn("text-sm", className)}>
      <code>{children}</code>
    </pre>
  ),
);

Preview.displayName = "Preview";

interface ReferenceTypeWrapperProps {
  children: React.ReactNode;
  onClickExpand: (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  expand?: boolean;
}
const ReferenceTypeWrapper = ({
  children,
  onClickExpand,
  expand,
}: ReferenceTypeWrapperProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClickExpand}
    onKeyDown={onClickExpand}
    className={cn(
      "flex gap-x-2 outline-none",
      !expand ? "flex-row items-center" : `flex-col`,
    )}
  >
    {children}
  </div>
);

interface CodePreviewerProps {
  arg: unknown;
  depth: number;
}

const CodePreviewer = ({ arg, depth }: CodePreviewerProps) => {
  const [toggle, setToggle] = useState(false);
  const Icon = toggle ? ChevronDownIcon : ChevronRightIcon;
  const renderIcon = <Icon className="h-5 w-5 outline-none " />;
  let appendDepth = depth;

  const handleExpand = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation();
    setToggle((prev) => !prev);
  };

  if (Array.isArray(arg) || arg instanceof Set) {
    appendDepth += 1;
    const isSet = arg instanceof Set;
    const toArray = isSet ? Array.from(arg) : arg;
    return (
      <ReferenceTypeWrapper expand={toggle} onClickExpand={handleExpand}>
        <div className="flex">
          {renderIcon}
          <Preview className="text-teal-500">{`${arg.constructor.name}(${toArray.length})`}</Preview>
        </div>

        {toArray.map((item, i) => (
          <span key={i} className={cn(toggle ? "flex" : "hidden")}>
            {toggle && <Preview className="ml-5 font-semibold">{i}: </Preview>}
            <CodePreviewer arg={item} depth={appendDepth} />
          </span>
        ))}
      </ReferenceTypeWrapper>
    );
  }

  if (typeof arg === "object" && arg !== null) {
    appendDepth += 1;
    const isMap = arg instanceof Map;
    const toObject = isMap ? Object.fromEntries(arg) : arg;
    return (
      <ReferenceTypeWrapper expand={toggle} onClickExpand={handleExpand}>
        <div className="flex">
          {renderIcon}
          <Preview className="text-teal-500">{arg.constructor.name}</Preview>
        </div>

        {Object.entries(toObject).map(([key, value]) => (
          <span key={key} className={cn(toggle ? "flex" : "hidden")}>
            {toggle && (
              <Preview className="ml-5 font-semibold">{`${key}: `}</Preview>
            )}
            <CodePreviewer arg={value} depth={appendDepth} />
          </span>
        ))}
      </ReferenceTypeWrapper>
    );
  }

  return (
    <Preview
      className={cn(
        {
          "text-purple-500":
            typeof arg === "number" ||
            typeof arg === "bigint" ||
            typeof arg === "boolean",
        },
        {
          "text-secondary-2 opacity-50":
            typeof arg === "undefined" || arg === null,
        },
      )}
    >
      {String(arg)}
    </Preview>
  );
};

interface ConsolePanelProps {
  result: Result;
  status: Status;
  preserveLogs: boolean;
  allowAutomaticCompilation: boolean;
  onSelectOption: (val: ConsoleType) => void;
  onExecuteCode: () => void;
}

const statusColorMap: Record<Status, string> = {
  running: "hidden",
  error: "text-error-main",
  success: "text-secondary-3",
};

export const consoleOptions: Record<ConsoleType, string> = {
  clear: "Clear console",
  preserve: "Preserve logs",
  automaticCompilation: "Automatic compilation",
};

export const ConsolePanel = ({
  result,
  status,
  preserveLogs,
  allowAutomaticCompilation,
  onSelectOption,
  onExecuteCode: handleExecuteCode,
}: ConsolePanelProps) => {
  const { ref, onHover, show } = useHover({ delay: 200 });
  const handleSelectOption = (val: ConsoleType) => {
    onSelectOption(val);
  };

  const options = Object.entries(consoleOptions).map(([key, value]) => ({
    label: value,
    value: key,
    ...(key === "preserve" && {
      renderLabel: (label: string) => (
        <div className="flex justify-between gap-x-4">
          <Text type="body-bold">{label}</Text>
          <Switch size="small" checked={preserveLogs} />
        </div>
      ),
    }),
    ...(key === "automaticCompilation" && {
      renderLabel: (label: string) => (
        <div className="flex justify-between gap-x-4">
          <Text type="body-bold">{label}</Text>
          <Switch size="small" checked={allowAutomaticCompilation} />
        </div>
      ),
    }),
  }));

  return (
    <div
      className={cn(
        "flex overflow-y-auto h-full flex-col border border-secondary-4",
      )}
    >
      <div className="relative p-2 gap-x-2 flex justify-end items-center border-b border-secondary-4">
        <PlayIcon
          className={cn(
            "outline-none text-secondary-4 w-5 h-auto transition duration-300 hover:text-primary-light",
          )}
          role="button"
          tabIndex={0}
          onClick={handleExecuteCode}
          onMouseEnter={() => onHover("in")}
          onMouseLeave={() => onHover("out")}
          ref={ref}
        />
        <Tooltip
          position="bottom"
          show={show}
          title="Execute code"
          description="Press &#8984; + S to execute code"
          targetElement={ref.current}
          className="left-[calc(100%-120px)] w-44"
        />
        <Dropdown
          button={
            <EllipsisHorizontalIcon
              className="outline-none text-secondary-4 w-5 h-auto transition duration-300 hover:text-secondary-1"
              role="button"
            />
          }
          options={options}
          menuClassName="top-4 right-0"
          onSelect={handleSelectOption}
        />
      </div>
      {result.map((args, index, arr) => (
        <div
          key={index}
          className={cn(
            "flex p-2 gap-x-4",
            arr.length > 1 && "border-b border-secondary-4",
            statusColorMap[status],
          )}
        >
          {args.map((arg: unknown, i) => (
            <CodePreviewer depth={0} key={i} arg={arg} />
          ))}
        </div>
      ))}
    </div>
  );
};

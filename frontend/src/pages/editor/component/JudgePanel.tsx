import { ChartBarIcon } from "@heroicons/react/20/solid";
import { ProgressBar } from "@waitingonalice/design-system/components/progress";
import { cn } from "@waitingonalice/design-system/utils/cn";
import { Spinner, Tooltip } from "@/components";
import { useAppContext } from "@/components/app-context";
import { useCodeJudge } from "../hooks/useCodeJudge";
import { useHover } from "../hooks/useHover";
import { GetExecutedResultType } from "../loaders/execute";
import { Preview } from "./ConsolePanel";

interface LoadingPanelProps {
  progress: number;
}
const LoadingPanel = ({ progress }: LoadingPanelProps) => (
  <div className="px-8 pt-8 absolute w-full h-full bg-secondary-4 opacity-50 flex items-center justify-center flex-col gap-y-4">
    <ProgressBar value={progress} />
    <span className="flex gap-x-4">
      <Spinner /> <code>Running...</code>
    </span>
  </div>
);

interface InfoPanelProps {
  data?: GetExecutedResultType;
  type: "Memory" | "Time" | "Status";
}

const InfoPanel = ({ data, type }: InfoPanelProps) => {
  const statusHeaderMap = {
    Memory: `${data?.result.output?.memory || 0} KB`,
    Time: `${data?.result.output?.time || 0} seconds`,
    Status:
      data?.result.status === "ERROR"
        ? `${data?.result.status}: ${data?.result.output?.stderr}`
        : data?.result.status,
  };
  return (
    <Preview>
      {type}:&nbsp;
      {data?.result ? (
        <span
          className={cn(
            "text-primary-light",
            data.result.status === "ERROR" && "text-error-main",
          )}
        >
          {statusHeaderMap[type]}
        </span>
      ) : (
        <span className="text-secondary-4 opacity-80">N/A</span>
      )}
    </Preview>
  );
};

interface JudgePanelProps {
  code: string;
}

export const JudgePanel = ({ code }: JudgePanelProps) => {
  const { onExecuteCode, data, loading, progress } = useCodeJudge();
  const { renderToast } = useAppContext();
  const { ref, onHover, show } = useHover({ delay: 200 });

  const handleExecute = async () => {
    if (loading) return;
    try {
      onExecuteCode(code);
    } catch (err) {
      if (err instanceof Error)
        renderToast({
          title: err.message,
          variant: "destructive",
        });
    }
  };

  return (
    <div className="flex overflow-y-auto h-full flex-col border border-secondary-4 relative">
      <div className="relative p-2 gap-x-2 flex justify-end items-center border-b border-secondary-4">
        <ChartBarIcon
          className={cn(
            "outline-none text-secondary-4 w-5 h-auto transition duration-300 hover:text-primary-light",
          )}
          role="button"
          tabIndex={0}
          onClick={handleExecute}
          onMouseEnter={() => onHover("in")}
          onMouseLeave={() => onHover("out")}
          ref={ref}
        />
        <Tooltip
          position="bottom"
          show={show}
          description="Run benchmarks for your code to see how it performs."
          targetElement={ref.current}
          className="-right-40"
        />
      </div>
      {loading ? (
        <LoadingPanel progress={progress} />
      ) : (
        <div className="py-2 px-4 flex flex-col gap-y-4 text-secondary-3">
          <InfoPanel data={data} type="Status" />
          <InfoPanel data={data} type="Memory" />
          <InfoPanel data={data} type="Time" />
        </div>
      )}
    </div>
  );
};

import { useExecuteCode, useGetExecutedResult } from "../loaders/execute";

export const useCodeJudge = () => {
  const [executeCode, executeCodeOptions] = useExecuteCode();
  const [executedCodeOptions, progress] = useGetExecutedResult(
    executeCodeOptions.data?.result,
  );

  const loading =
    executeCodeOptions.isLoading ||
    executedCodeOptions.isLoading ||
    executedCodeOptions.data?.result.status === "COMPILING" ||
    executedCodeOptions.data?.result.status === "PENDING";

  const onExecuteCode = async (code: string) => {
    if (loading) return;
    executeCode({
      input: {
        code,
        languageId: 94, // currently hard code typescript (5.0.3)
      },
    });
  };

  return { onExecuteCode, loading, data: executedCodeOptions.data, progress };
};

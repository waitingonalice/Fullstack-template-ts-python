import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { apiRoutes } from "@/constants";
import { request } from "@/utils";

interface ExecuteCodeResponseType {
  result: string;
}

interface ExecuteCodeBodyInputType {
  input: {
    languageId: number;
    code: string;
  };
}
let refetchInterval = 0;
export const useExecuteCode = () => {
  const fetch = (input: ExecuteCodeBodyInputType) =>
    request<ExecuteCodeResponseType>({
      url: apiRoutes.execute.code,
      method: "POST",
      input,
    });
  const { mutate, ...rest } = useMutation(fetch, {
    onSuccess: () => {
      refetchInterval = 3000;
    },
  });
  return [mutate, rest] as const;
};

export interface GetExecutedResultType {
  result: {
    status: "FINISHED" | "ERROR" | "PENDING" | "COMPILING";
    output: {
      time: number | null;
      memory: number | null;
      stdout: string | null;
      stderr: string | null;
    } | null;
  };
}
export const useGetExecutedResult = (token?: string) => {
  const [progress, setProgress] = useState(0);

  const data = useQuery({
    queryKey: ["getExecutionResult", token],
    queryFn: () =>
      request<GetExecutedResultType>({
        url: `${apiRoutes.execute.code}/${token}`,
      }),
    enabled: !!token,
    refetchInterval,
    onSuccess: (data) => {
      if (data.result.status === "COMPILING") {
        setProgress(33);
      } else if (data.result.status === "PENDING") {
        setProgress(66);
      } else {
        setProgress(0);
        refetchInterval = 0;
      }
    },
  });

  return [data, progress] as const;
};

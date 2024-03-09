import { useQuery } from "react-query";
import { apiRoutes } from "@/constants";
import { getCookie, request } from "@/utils";

export interface GetUserType {
  result: {
    id: string;
    firstName: string;
    lastName: string;
    country: string;
    email: string;
    active: boolean;
  };
}
export const useGetUser = () => {
  const token = getCookie("authToken");

  return useQuery({
    queryKey: "user",
    queryFn: () =>
      request<GetUserType>({
        url: apiRoutes.user.get,
      }),
    enabled: !!token ?? false,
  });
};

import { useMutation } from "react-query";
import { apiRoutes } from "@/constants";
import { request } from "@/utils";

export interface CollectionType {
  code: string;
  title: string;
  description: string;
}
interface AddCollectionResponseType {
  result: CollectionType;
}
interface AddCollectionInputType {
  input: CollectionType;
}

export const useAddToCollection = () => {
  const { mutateAsync, ...rest } = useMutation(
    (input: AddCollectionInputType) =>
      request<AddCollectionResponseType>({
        url: apiRoutes.collections.addCollection,
        method: "POST",
        input,
      }),
  );
  const mutation = (input: AddCollectionInputType) => mutateAsync(input);

  return [mutation, rest] as const;
};

import {
  Toaster,
  useToast,
} from "@waitingonalice/design-system/components/toast";
import { createContext, useContext, useMemo } from "react";
import { GetUserType, useGetUser } from "./loaders/user";

interface AppContextProps {
  user?: GetUserType["result"];
  renderToast: ReturnType<typeof useToast>["renderToast"];
  dismissToast: ReturnType<typeof useToast>["dismiss"];
  updateToast: ReturnType<typeof useToast>["update"];
}

interface AppProps {
  children: React.ReactNode;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const App = ({ children }: AppProps) => {
  const { data } = useGetUser();
  const {
    renderToast,
    dismiss: dismissToast,
    update: updateToast,
  } = useToast();

  const value = useMemo(
    () => ({ user: data?.result, renderToast, dismissToast, updateToast }),
    [data?.result],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

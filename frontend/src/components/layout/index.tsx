import clsx from "clsx";
import Topbar from "./Topbar";

interface MainProps {
  children: React.ReactNode;
}

export const Main = ({ children }: MainProps) => <div>{children}</div>;

interface ContentProps {
  children: React.ReactNode;
  className?: string;
}
const Content = ({ children, className }: ContentProps) => (
  <section className={clsx(className)}>{children}</section>
);

Main.Header = Topbar;
Main.Content = Content;

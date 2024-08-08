import { ReactNode } from "react";
import NavigationBar from "../components/navbar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}

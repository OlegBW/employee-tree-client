import { ReactNode } from "react";
import NavigationBar from "../components/navbar";
import '../styles/layout.css';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationBar />
      <div className="layout-container">
        {children}
      </div>
    </>
  );
}

import { Navigate, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedWrapper({ children }: Props) {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  return accessToken ? (
    children
  ) : (
    <Navigate
      to={`/login`}
      state={{ from: location }}
      replace
    />
  );
}

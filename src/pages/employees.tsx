// import { useState } from "react"
// import { Employee } from "../types/employee"
import DefaultLayout from "../layouts/default";
import EmployeeTable from "../components/employee-table";

export default function EmployeePage() {
  return (
    <DefaultLayout>
      <EmployeeTable itemsPerPage={10} />
    </DefaultLayout>
  );
}

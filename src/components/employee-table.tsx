import { useEffect, useState } from "react";
import { Employee } from "../types/employee";
import FilterComponent from "./filter";
import "bootstrap/dist/css/bootstrap.min.css";

type PaginatedEmployees = {
  count: number;
  results: Employee[];
};

type Filter = {
  name: string;
  value: string;
};

const baseUrl = "http://localhost:8000/api/employees/";

function constructUrl(
  page: number,
  ordering: string | null,
  filter: Filter | null
) {
  let res = baseUrl + `?page=${page}`;

  if (ordering) {
    res += `&ordering=${ordering}`;
  }

  if (filter) {
    res += `&${filter.name}=${filter.value}`;
  }

  return res;
}

const EmployeeTable = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<null | string>(null);
  const [filter, setFilter] = useState<Filter | null>(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    async function fetchEmployees() {
      const url = constructUrl(currentPage, ordering, filter);
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error("Bad request");
      }

      const paginatedEmployees: PaginatedEmployees = await resp.json();
      setTotalItems(() => paginatedEmployees.count);
      setEmployees(() => paginatedEmployees.results);
    }

    fetchEmployees();
  }, [currentPage, filter, ordering]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  function onColumnClick(colName: string) {
    setOrdering(ordering === `+${colName}` ? `-${colName}` : `+${colName}`);
  }

  function onFilter(field: string, value: string) {
    setFilter({
      name: field,
      value,
    });
    console.log(field, value);
  }

  return (
    <div className="container mt-4">
      <FilterComponent onFilter={onFilter} />
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("id")}
              >
                ID
              </button>
            </th>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("name")}
              >
                Name
              </button>
            </th>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("email")}
              >
                Email
              </button>
            </th>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("position")}
              >
                Position
              </button>
            </th>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("hiring_date")}
              >
                Hiring Date
              </button>
            </th>
            <th>
              <button
                className="btn btn-link p-0"
                onClick={() => onColumnClick("manager_id")}
              >
                Manager ID
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.position}</td>
              <td>{employee.hiring_date}</td>
              <td>{employee.manager_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmployeeTable;

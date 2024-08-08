import "bootstrap/dist/css/bootstrap.min.css";
import { Employee } from "../types/employee";

import { ChangeEvent, useEffect, useState } from "react";

type PaginatedEmployees = {
  count: number;
  results: Employee[];
};

type Filter = {
  name: string;
  value: string;
};

const baseUrl = "http://localhost:8000/api/employees/";

function constructUrl(page: number, ordering: string | null, filter: Filter | null) {
  let res = baseUrl + `?page=${page}`;

  if (ordering) {
    res += `&ordering=${ordering}`;
  }

  if (filter) {
    res += `&${filter.name}=${filter.value}`;
  }

  return res;
}

interface FilterComponentProps {
  fields: string[];
  onFilter: (field: string, value: string) => void;
}

function FilterComponent({ fields, onFilter }: FilterComponentProps) {
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [filterText, setFilterText] = useState("");

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedField(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleSubmit = () => {
    onFilter(selectedField, filterText);
  };

  const handleReset = () => {
    setSelectedField(fields[0]);
    setFilterText("");
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="filterField">Filter By:</label>
            {fields.map((field) => (
              <div key={field} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id={field}
                  name="filterField"
                  value={field}
                  checked={selectedField === field}
                  onChange={handleFieldChange}
                />
                <label className="form-check-label" htmlFor={field}>
                  {field}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="filterText">Filter Text:</label>
            <input
              id="filterText"
              type="text"
              className="form-control"
              value={filterText}
              onChange={handleInputChange}
              placeholder="Enter text to filter..."
            />
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-secondary me-2 px-4"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="btn btn-primary px-4"
            onClick={handleSubmit}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

const EditableTable = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalItems, setTotalItems] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordering, setOrdering] = useState<null | string>(null);
  const [filter, setFilter] = useState<Filter | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<null | Employee>(null);
  const [editedFields, setEditedFields] = useState<{ [key: string]: string | number }>({});

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
  }

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditedFields({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      hiring_date: employee.hiring_date,
      manager_id: employee.manager_id,
    });
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedFields({
      ...editedFields,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveClick = (employee: Employee) => {
    console.log("Saving employee:", { ...employee, ...editedFields });
    // Replace the console.log with the actual API call to save changes
    setEditingEmployee(null);
  };

  const handleDeleteClick = (employee: Employee) => {
    console.log("Deleting employee:", employee);
    // Replace the console.log with the actual API call to delete the employee
  };

  return (
    <div className="container mt-4">
      <FilterComponent
        fields={["name", "email", "position", "hiring_date", "id", "manager_id"]}
        onFilter={onFilter}
      />
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedFields.name}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                ) : (
                  employee.name
                )}
              </td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <input
                    type="text"
                    name="email"
                    value={editedFields.email}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                ) : (
                  employee.email
                )}
              </td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <input
                    type="text"
                    name="position"
                    value={editedFields.position}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                ) : (
                  employee.position
                )}
              </td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <input
                    type="text"
                    name="hiring_date"
                    value={editedFields.hiring_date}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                ) : (
                  employee.hiring_date
                )}
              </td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <input
                    type="text"
                    name="manager_id"
                    value={editedFields.manager_id}
                    onChange={handleFieldChange}
                    className="form-control"
                  />
                ) : (
                  employee.manager_id
                )}
              </td>
              <td>
                {editingEmployee?.id === employee.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleSaveClick(employee)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingEmployee(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(employee)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
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

export default EditableTable;

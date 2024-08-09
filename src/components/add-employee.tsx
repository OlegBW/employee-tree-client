import { useState, ChangeEvent, FormEvent } from "react";

type Employee = {
  name: string;
  email: string;
  position: string;
  manager_id: number;
};

const url = "http://localhost:8000/api/employees/create";

const AddEmployeeForm = () => {
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    position: "",
    manager_id: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setEmployee({
      ...employee,
      [id]: id === "manager_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        setSuccess("Employee added successfully!");
        setEmployee({
          name: "",
          email: "",
          position: "",
          manager_id: 0,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to add employee");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <h2 className="mb-4">Add Employee</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter employee name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter employee email"
            value={employee.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="position" className="form-label">
            Position
          </label>
          <input
            type="text"
            id="position"
            className="form-control"
            placeholder="Enter employee position"
            value={employee.position}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="manager_id" className="form-label">
            Manager ID
          </label>
          <input
            type="number"
            id="manager_id"
            className="form-control"
            placeholder="Enter manager ID"
            value={employee.manager_id}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;

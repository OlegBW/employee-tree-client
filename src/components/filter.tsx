import { useState, ChangeEvent } from 'react';

interface FilterComponentProps {
  onFilter: (field: string, value: string) => void;
}

const fields = ['Name', 'Email', 'Position', 'Hiring Date', 'ID', 'Manager ID'];

const fieldNames: Record<string, string> = {
  ID: 'id',
  Name: 'name',
  Email: 'email',
  Position: 'position',
  'Hiring Date': 'hiring_date',
  'Manager ID': 'manager_id',
};

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {
  const [selectedField, setSelectedField] = useState(fields[0]);
  const [filterText, setFilterText] = useState('');

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedField(event.target.value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleSubmit = () => {
    onFilter(fieldNames[selectedField], filterText);
  };

  const handleReset = () => {
    setSelectedField(fields[0]);
    setFilterText('');
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row">
        <div className="col-md-4 d-flex align-items-center">
          <div className="form-group me-3">
            <label htmlFor="filterField" className="form-label">
              Filter By:
            </label>
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

        <div className="col-md-4 d-flex align-items-center">
          <div className="form-group w-100">
            <label htmlFor="filterText" className="form-label">
              Filter Text:
            </label>
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

        <div className="col-md-4 d-flex align-items-center justify-content-end">
          <button className="btn btn-secondary me-2" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TreePage from "./pages/tree";
import EmployeePage from './pages/employees';
// import TreePage from './TreePage';
// import EmployeePage from './EmployeePage';

const AppRouter = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/tree" element={<TreePage />} />
        <Route path="/employees" element={<EmployeePage />} />
    </Routes>
      
      {/* <Route path="/employee" element={EmployeePage} />
      <Route path="/" element={() => <div>Home Page</div>} /> */}
    </BrowserRouter>
  );
};

export default AppRouter;

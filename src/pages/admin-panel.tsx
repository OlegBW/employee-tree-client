import DefaultLayout from "../layouts/default";
import EditableTable from "../components/editable-table";

export default function AdminPanelPage() {
  return (
    <DefaultLayout>
      <EditableTable itemsPerPage={10}/>
    </DefaultLayout>
  );
}

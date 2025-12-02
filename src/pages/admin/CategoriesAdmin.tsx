import CrudPage from '../../components/admin/CrudPage';
import { getCategories, createCategory, updateCategory, deleteCategory, type Category } from '../../utils/api';

const CategoriesAdmin = () => {
    return (
        <CrudPage<Category>
            title="Manage Categories"
            fetchData={getCategories}
            createItem={createCategory}
            updateItem={updateCategory}
            deleteItem={deleteCategory}
            columns={[
                { key: 'name', label: 'Name' },
                { key: 'description', label: 'Description' },
                { key: 'bookCount', label: 'Books' },
            ]}
            formFields={[
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
            ]}
        />
    );
};

export default CategoriesAdmin;

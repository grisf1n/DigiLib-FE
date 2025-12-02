import CrudPage from '../../components/admin/CrudPage';
import { getUsers, createUser, updateUser, deleteUser, type User } from '../../utils/api';

const UsersAdmin = () => {
    return (
        <CrudPage<User>
            title="Manage Users"
            fetchData={getUsers}
            createItem={createUser}
            updateItem={updateUser}
            deleteItem={deleteUser}
            columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'role', label: 'Role' },
            ]}
            formFields={[
                { name: 'name', label: 'Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'password', label: 'Password', type: 'password', required: true }, // Only for create
                // Note: Role selection could be added here if backend supports it
            ]}
            transformDataBeforeSubmit={(data) => {
                // If updating, we might not want to send password if it's empty, 
                // but generic form sends everything. Backend should handle optional password update or we need specific logic.
                // For now, we assume standard create/update.
                return data;
            }}
        />
    );
};

export default UsersAdmin;

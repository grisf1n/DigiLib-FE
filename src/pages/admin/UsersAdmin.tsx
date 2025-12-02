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
                { name: 'password', label: 'Password', type: 'password', required: false },

                {
                    name: 'role',
                    label: 'Role',
                    type: 'select',
                    required: true,
                    options: [
                        { label: 'Admin', value: 'admin' },
                        { label: 'Librarian', value: 'librarian' },
                        { label: 'Member', value: 'user' },
                    ]
                },
            ]}
            transformDataBeforeSubmit={(data) => {
                if (!data.password) {
                    delete data.password;
                }
                return data;
            }}
        />
    );
};

export default UsersAdmin;

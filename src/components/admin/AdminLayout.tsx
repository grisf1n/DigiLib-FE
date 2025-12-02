import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();

    const tabs = [
        { name: 'Books', path: '/dashboard/books' },
        { name: 'Categories', path: '/dashboard/categories' },
        { name: 'Users', path: '/dashboard/users' },
        { name: 'Borrows', path: '/dashboard/borrows' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage library resources and users</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <nav className="flex overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive = location.pathname.startsWith(tab.path);
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive
                                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <Outlet />
        </div>
    );
};

export default AdminLayout;

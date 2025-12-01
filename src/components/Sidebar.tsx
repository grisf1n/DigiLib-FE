import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/api';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const menuItems = [
        {
            name: 'Dashboard', path: '/home', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            )
        },
        {
            name: 'Buku Dipinjam', path: '/borrowed', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            name: 'Wishlist', path: '/wishlist', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            name: 'Riwayat', path: '/history', icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="h-16 bg-emerald-600 flex items-center px-6">
                    <h1 className="text-white text-xl font-bold">Digilib</h1>
                </div>

                {/* User Info */}
                <div
                    className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                        navigate('/profile');
                        onClose();
                    }}
                >
                    <p className="text-gray-500 text-sm">Selamat Datang,</p>
                    <p className="text-gray-900 font-bold text-lg truncate">
                        {user?.name || "User"}
                    </p>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <button
                                        onClick={() => {
                                            navigate(item.path);
                                            onClose();
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="font-medium">{item.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;

import { useNavigate } from "react-router-dom";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const navigate = useNavigate();
    return (
        <header className="bg-emerald-600 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="text-white p-1 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-white text-xl font-bold tracking-wide">Digilib</h1>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/profile')} className="text-white p-1 hover:bg-emerald-500 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header;

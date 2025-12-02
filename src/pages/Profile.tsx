import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../utils/api";
import Button from "../components/Button";

const Profile = () => {
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* HEADER */}
            <div className="bg-emerald-600 rounded-b-2xl px-4 pt-6 pb-12 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mt-6">My Profile</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-8 sm:px-6 md:px-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar Placeholder */}
                        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user?.name || "User"}</h2>
                            <p className="text-gray-500">{user?.email || "email@example.com"}</p>
                            <div
                                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium
        ${user?.role === "admin"
                                        ? "bg-purple-50 text-purple-700"
                                        : user?.role === "librarian"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-emerald-50 text-emerald-700"
                                    }
    `}
                            >
                                {user?.role === "admin"
                                    ? "Admin"
                                    : user?.role === "librarian"
                                        ? "Librarian"
                                        : "Member"}
                            </div>

                        </div>

                        <div className="w-full sm:w-auto">
                            <Button
                                variant="secondary"
                                className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-100 pt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <p className="text-gray-900 font-medium">{user?.name || "-"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                <p className="text-gray-900 font-medium">{user?.email || "-"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                                <p className="text-gray-900 font-medium">
                                    {new Date().toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

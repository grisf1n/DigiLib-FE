import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard, { BooksAdmin, CategoriesAdmin, UsersAdmin, BorrowsAdmin } from './pages/admin';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import CategoryBooks from './pages/CategoryBooks';
import BorrowedBooks from './pages/BorrowedBooks';
import Profile from './pages/Profile';
import MainLayout from './components/MainLayout';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import StatisticsPage from './pages/admin/StatisticPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <MainLayout><Dashboard /></MainLayout>
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard/statistics" element={<StatisticsPage />} />
                    <Route path="books" element={<BooksAdmin />} />
                    <Route path="categories" element={<CategoriesAdmin />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="borrows" element={<BorrowsAdmin />} />
                    <Route index element={<Navigate to="books" replace />} />
                </Route>

                <Route path="/home" element={<ProtectedRoute><MainLayout><Home /></MainLayout></ProtectedRoute>} />
                <Route path="/borrowed" element={<ProtectedRoute><MainLayout><BorrowedBooks /></MainLayout></ProtectedRoute>} />
                <Route path="/book/:id" element={<ProtectedRoute><MainLayout><BookDetail /></MainLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
                <Route path="/category/:id" element={<ProtectedRoute><MainLayout><CategoryBooks /></MainLayout></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

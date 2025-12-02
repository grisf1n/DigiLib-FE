import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    bookCount: number;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    year: number;
    stock: number;
    available: number;
    description: string;
    coverImage: string;
    categoryId: number;
    categoryName: string;
    uploadedBy: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getBooks = async (): Promise<ApiResponse<Book[]>> => {
    const response = await api.get<ApiResponse<Book[]>>('/book');
    return response.data;
};

export const getBookDetail = async (id: number): Promise<ApiResponse<Book>> => {
    const response = await api.get<ApiResponse<Book>>(`/book/${id}`);
    return response.data;
};

export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    const response = await api.get<ApiResponse<Category[]>>('/category');
    return response.data;
};

export interface CategoryBooksResponse {
    success: boolean;
    category: Category;
    data: Book[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const getBooksByCategory = async (id: number): Promise<CategoryBooksResponse> => {
    const response = await api.get<CategoryBooksResponse>(`/category/${id}/books`);
    return response.data;
};

export const getImageUrl = (filename: string) => {
    if (!filename) return 'https://placehold.co/300x450?text=No+Cover';
    if (filename.startsWith('http')) return filename;
    return `${API_BASE_URL}/uploads/${filename}`;
};

export interface BorrowItem {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: string | null;
    dueDate: string | null;
    returnDate: string | null;
    status: "pending" | "borrowed" | "rejected" | "returned";
    approvedBy: number | null;
    rejectedReason: string | null;
    processedBy: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export const getSelfBorrowed = async (): Promise<ApiResponse<BorrowItem[]>> => {
    const response = await api.get<ApiResponse<BorrowItem[]>>('/borrow/self');
    return response.data;
};

export async function returnBorrow(id: number) {
    return api.post(`/borrow/${id}/return`);
}

export default api;
// --- New CRUD helper functions and types ---

// User type (minimal)
export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

// Books CRUD
export const createBook = async (data: Partial<Book>) => {
    return api.post<Book>('/book', data);
};
export const updateBook = async (id: number, data: Partial<Book>) => {
    return api.put<Book>(`/book/${id}`, data);
};
export const deleteBook = async (id: number) => {
    return api.delete(`/book/${id}`);
};

// Categories CRUD
export const createCategory = async (data: { name: string; description: string }) => {
    return api.post<Category>('/category', data);
};
export const updateCategory = async (id: number, data: { name?: string; description?: string }) => {
    return api.put<Category>(`/category/${id}`, data);
};
export const deleteCategory = async (id: number) => {
    return api.delete(`/category/${id}`);
};

// Users CRUD (manage-user)
export const getUsers = async (search = '') => {
    return api.get<ApiResponse<User[]>>(`/manage-user?search=${search}`);
};
export const createUser = async (data: { name: string; email: string; password: string }) => {
    return api.post<User>('/manage-user', data);
};
export const updateUser = async (id: number, data: Partial<User>) => {
    return api.put<User>(`/manage-user/${id}`, data);
};
export const deleteUser = async (id: number) => {
    return api.delete(`/manage-user/${id}`);
};
export const changePassword = async (id: number, password: string) => {
    return api.patch(`/manage-user/${id}/password`, { password });
};

export const getBorrows = async () => {
    return api.get<ApiResponse<BorrowItem[]>>('/borrow');
};

// Borrow admin actions
export const approveBorrow = async (id: number) => {
    return api.post(`/borrow/${id}/approve`);
};
export const rejectBorrow = async (id: number, reason: string) => {
    return api.post(`/borrow/${id}/reject`, { reason });
};

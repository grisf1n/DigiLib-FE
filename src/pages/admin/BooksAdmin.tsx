import CrudPage from '../../components/admin/CrudPage';
import { getBooks, createBook, updateBook, deleteBook, type Book, getImageUrl, getCategories } from '../../utils/api';
import { useEffect, useState } from 'react';

const BooksAdmin = () => {
    const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);

    useEffect(() => {
        getCategories().then(res => {
            setCategories(res.data.map(c => ({ label: c.name, value: c.id })));
        });
    }, []);

    return (
        <CrudPage<Book>
            title="Manage Books"
            fetchData={getBooks}
            createItem={createBook}
            updateItem={updateBook}
            deleteItem={deleteBook}
            columns={[
                {
                    key: 'coverImage',
                    label: 'Cover',
                    render: (book) => (
                        <img
                            src={getImageUrl(book.coverImage)}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-sm"
                        />
                    )
                },
                { key: 'title', label: 'Title' },
                { key: 'author', label: 'Author' },
                { key: 'categoryName', label: 'Category' },
                { key: 'stock', label: 'Stock' },
                { key: 'available', label: 'Available' },
            ]}
            formFields={[
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'author', label: 'Author', type: 'text', required: true },
                { name: 'publisher', label: 'Publisher', type: 'text', required: true },
                { name: 'isbn', label: 'ISBN', type: 'text', required: true },
                { name: 'year', label: 'Year', type: 'number', required: true },
                { name: 'stock', label: 'Stock', type: 'number', required: true },
                { name: 'categoryId', label: 'Category', type: 'select', options: categories, required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                // Note: File upload for coverImage is not yet implemented in generic form, using text URL for now or need extension
                { name: 'coverImage', label: 'Cover Image URL', type: 'text', required: false },
            ]}
            transformDataBeforeSubmit={(data) => ({
                ...data,
                year: Number(data.year),
                stock: Number(data.stock),
                categoryId: Number(data.categoryId)
            })}
        />
    );
};

export default BooksAdmin;

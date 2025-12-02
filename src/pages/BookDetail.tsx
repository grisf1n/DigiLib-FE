import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetail, getBooks, getImageUrl, getSelfBorrowed, returnBorrow, type Book, type BorrowItem } from '../utils/api';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import BookCard from '../components/BookCard';
import { getToken } from '../utils/api';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [currentBorrow, setCurrentBorrow] = useState<BorrowItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [bookRes, booksRes, borrowRes] = await Promise.all([
                    getBookDetail(Number(id)),
                    getBooks(),
                    getSelfBorrowed()
                ]);

                if (bookRes.success) {
                    setBook(bookRes.data);
                }
                if (booksRes.success) {
                    setBooks(booksRes.data);
                }
                if (borrowRes.success) {
                    const activeBorrow = borrowRes.data.find(
                        (b) => b.bookId === Number(id) && (b.status === 'pending' || b.status === 'borrowed')
                    );
                    setCurrentBorrow(activeBorrow || null);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchBorrowStatus = async () => {
        try {
            const borrowRes = await getSelfBorrowed();
            if (borrowRes.success) {
                const activeBorrow = borrowRes.data.find(
                    (b) => b.bookId === Number(id) && (b.status === 'pending' || b.status === 'borrowed')
                );
                setCurrentBorrow(activeBorrow || null);
            } else {
                setCurrentBorrow(null);
            }
        } catch (error) {
            console.error("Failed to fetch borrow status", error);
        }
    };

    const borrowBook = async () => {
        try {
            const res = await fetch(`http://localhost:3000/borrow/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                }
            });

            const data = await res.json();

            if (data.success) {
                alert("Success borrow book!");
                fetchBorrowStatus();
            } else {
                alert("Failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error borrowing book");
        }
    };

    const handleReturn = async () => {
        if (!currentBorrow) return;
        if (!confirm("Are you sure you want to return this book?")) return;

        try {
            await returnBorrow(currentBorrow.id);
            alert("Book returned successfully!");
            fetchBorrowStatus();
        } catch (err) {
            console.error(err);
            alert("Error returning book");
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!book) {
        return <div className="min-h-screen flex items-center justify-center">Book not found</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-emerald-600 rounded-b-2xl px-4 pt-6 pb-12 sm:px-6 md:px-8 relative">
                <div className="max-w-4xl mx-auto">

                    {/* Hero Section */}
                    <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                        {/* Book Cover */}
                        <div className="w-40 sm:w-48 md:w-56 flex-shrink-0 rounded-lg overflow-hidden shadow-lg mx-auto sm:mx-0">
                            <img
                                src={getImageUrl(book.coverImage)}
                                alt={book.title}
                                className="w-full h-auto object-cover aspect-[2/3]"
                            />
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 text-white w-full">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center sm:text-left">{book.title}</h1>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-8">
                                <span className="bg-emerald-500/50 px-3 py-1 rounded-md text-sm font-medium">
                                    {book.categoryName}
                                </span>
                                <span className="bg-emerald-500/50 px-3 py-1 rounded-md text-sm font-medium">
                                    {book.year}
                                </span>
                                {/* <span className="bg-emerald-500/50 px-3 py-1 rounded-md text-sm font-medium">
                                    Stock: {book.available}
                                </span> */}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {/* <Button
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white w-full"
                                >
                                    Read
                                </Button> */}
                                <div className="flex gap-3">
                                    {/* <Button
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white flex-1"
                                    >
                                        Add to List
                                    </Button> */}
                                    {currentBorrow?.status === 'pending' ? (
                                        <Button
                                            className="bg-gray-400 cursor-not-allowed text-white flex-1"
                                            disabled
                                        >
                                            Pending Approval
                                        </Button>
                                    ) : currentBorrow?.status === 'borrowed' ? (
                                        <Button
                                            className="bg-blue-500 hover:bg-blue-400 text-white flex-1"
                                            onClick={handleReturn}
                                        >
                                            Return Book
                                        </Button>
                                    ) : (
                                        <Button
                                            className="bg-emerald-500 hover:bg-emerald-400 text-white flex-1"
                                            onClick={borrowBook}
                                        >
                                            Borrow
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-white">
                        <p className="text-sm sm:text-base leading-relaxed">
                            {book.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Featured Section (All Books) */}
            <div className="mb-8 mt-8 mx-auto max-w-4xl px-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Featured</h2>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                    {books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onClick={() => navigate(`/book/${book.id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;

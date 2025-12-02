import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, getCategories, getBookDetail, getImageUrl, type Book, type Category } from '../utils/api';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import CategoryPill from '../components/CategoryPill';
import Button from '../components/Button';

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all books
                const booksResponse = await getBooks();
                if (booksResponse.success) {
                    setBooks(booksResponse.data);
                    if (booksResponse.data.length > 0) {
                        setFeaturedBook(booksResponse.data[0]);
                    }
                }

                // Fetch categories
                const categoriesResponse = await getCategories();
                if (categoriesResponse.success) {
                    setCategories(categoriesResponse.data);
                }

            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredBooks([]);
            setShowResults(false);
            return;
        }

        const q = searchQuery.toLowerCase();
        const results = books.filter(
            (b) =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q)
        );

        setFilteredBooks(results);
        setShowResults(true);
    }, [searchQuery, books]);


    const newestBooks = books.slice(0, 3); // Assuming API returns newest first or we just take first 3

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Green Header Background */}
            <div className="bg-emerald-600 rounded-b-2xl px-4 pt-6 pb-4 sm:px-6 md:px-8 relative z-0">
                <div className="max-w-4xl mx-auto">
                    {/* Search Bar */}
                    <div className="mb-8 relative">
                        <SearchBar
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowResults(true);
                            }}
                        />

                        {/* 🔍 Popup Search Results */}
                        {showResults && searchQuery.trim() !== '' && (
                            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
                                {filteredBooks.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-center text-sm">
                                        No results found
                                    </div>
                                ) : (
                                    filteredBooks.map((book) => (
                                        <div
                                            key={book.id}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                setShowResults(false);
                                                navigate(`/book/${book.id}`);
                                            }}
                                        >
                                            <img
                                                src={getImageUrl(book.coverImage)}
                                                className="w-10 h-14 object-cover rounded"
                                                alt={book.title}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {book.title}
                                                </p>
                                                <p className="text-gray-500 text-xs">{book.author}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>


                    {/* Hero Section (Featured Book) */}
                    {featuredBook ? (
                        <div className="flex gap-6 items-start mb-4">
                            {/* Book Cover */}
                            <div className="w-32 sm:w-40 md:w-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg mx-auto sm:mx-0">
                                <img
                                    src={getImageUrl(featuredBook.coverImage)}
                                    alt={featuredBook.title}
                                    className="w-full h-auto object-cover aspect-[2/3]"
                                />
                            </div>

                            {/* Book Info */}
                            <div className="flex-1 text-white text-left">
                                <h1 className="text-2xl sm:text-3xl font-bold mb-3">{featuredBook.title}</h1>
                                <p className="text-emerald-100 text-sm sm:text-base mb-4 line-clamp-3">
                                    {featuredBook.description}
                                </p>

                                {/* Tags/Category */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="bg-emerald-500/50 px-3 py-1 rounded-md text-xs font-medium">
                                        {featuredBook.categoryName}
                                    </span>
                                    <span className="bg-emerald-500/50 px-3 py-1 rounded-md text-xs font-medium">
                                        {featuredBook.year}
                                    </span>
                                </div>

                                <Button
                                    className="hover:bg-emerald-400 text-white w-full sm:w-auto px-8"
                                    onClick={() => navigate(`/book/${featuredBook.id}`)}
                                >
                                    Details
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Fallback if featured book not found (or loading)
                        <div className="h-64 flex items-center justify-center text-white/50">
                            {loading ? 'Loading...' : 'Featured book not found'}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-16 sm:px-6 md:px-8 -mt-6 relative z-10">
                {/* Newest Section */}
                <div className="bg-emerald-600 rounded-2xl p-4 sm:p-6 mb-8 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">Newest</h2>
                    <div className="space-y-4">
                        {newestBooks.map((book) => (
                            <div
                                key={book.id}
                                className="flex gap-4 items-center cursor-pointer hover:bg-emerald-500/20 p-2 rounded-lg transition-colors"
                                onClick={() => navigate(`/book/${book.id}`)}
                            >
                                <div className="w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                                    <img src={getImageUrl(book.coverImage)} alt={book.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-lg mb-1">{book.title}</h3>
                                    <p className="text-emerald-100 text-sm">
                                        {new Date(book.createdAt).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Section (All Books) */}
                <div className="mb-8">
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

                {/* Categories Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <CategoryPill
                                key={category.id}
                                label={category.name}
                                onClick={() => navigate(`/category/${category.id}`)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

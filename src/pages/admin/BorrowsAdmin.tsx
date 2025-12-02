import CrudPage from '../../components/admin/CrudPage';
import { getBorrows, approveBorrow, returnBorrow, type BorrowItem } from '../../utils/api';

const BorrowsAdmin = () => {
    const handleApprove = async (id: number, refresh: () => void) => {
        try {
            await approveBorrow(id);
            refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to approve borrow');
        }
    };

    const handleReturn = async (id: number, refresh: () => void) => {
        if (!window.confirm('Mark this book as returned?')) return;
        try {
            await returnBorrow(id);
            refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to return book');
        }
    };

    return (
        <CrudPage<BorrowItem>
            title="Manage Borrows"
            fetchData={getBorrows}
            // No create/update/delete for borrows in this simple admin, only status changes
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'userId', label: 'User ID' },
                { key: 'bookId', label: 'Book ID' },
                {
                    key: 'borrowDate',
                    label: 'Borrow Date',
                    render: (item) => item.borrowDate ? new Date(item.borrowDate).toLocaleDateString() : '-'
                },
                {
                    key: 'dueDate',
                    label: 'Due Date',
                    render: (item) => item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'
                },
                {
                    key: 'status',
                    label: 'Status',
                    render: (item) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'borrowed' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'returned' ? 'bg-green-100 text-green-800' :
                                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                            }`}>
                            {item.status.toUpperCase()}
                        </span>
                    )
                },
            ]}
            actions={(item, refresh) => (
                <>
                    {item.status === 'pending' && (
                        <button
                            onClick={() => handleApprove(item.id, refresh)}
                            className="text-emerald-600 hover:text-emerald-800 font-medium mr-2"
                        >
                            Approve
                        </button>
                    )}
                    {item.status === 'borrowed' && (
                        <button
                            onClick={() => handleReturn(item.id, refresh)}
                            className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                        >
                            Return
                        </button>
                    )}
                </>
            )}
        />
    );
};

export default BorrowsAdmin;

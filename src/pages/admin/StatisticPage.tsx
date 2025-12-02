import { useEffect, useState } from "react";
import { getBorrows } from "../../utils/api";

type BorrowItem = {
    id: number;
    bookId: number;
    userId: number;
    status: "borrowed" | "returned";
    createdAt: string;
};

type DailyRecord = {
    id: number;
    date: string;
    borrowCount: number;
    returnCount: number;
};

type ReportType = {
    totalBorrowed: number;
    totalReturned: number;
    daily: DailyRecord[];
};


const StatisticsPage = () => {
    const [borrowData, setBorrowData] = useState<BorrowItem[]>([]);
    const [report, setReport] = useState<ReportType | null>(null);
    const [summary, setSummary] = useState({ borrowed: 0, returned: 0 });
    const [range, setRange] = useState({ start: "", end: "" });

    useEffect(() => {
        loadAllBorrowData();
    }, []);

    const loadAllBorrowData = async () => {
        const data = await getBorrows();
        setBorrowData(data as any);

        const borrowed = data.filter((b) => b.status === "borrowed").length;
        const returned = data.filter((b) => b.status === "returned").length;

        setSummary({ borrowed, returned });
    };

    const loadReport = () => {
        if (!range.start || !range.end) return alert("Isi start & end");

        const start = new Date(range.start);
        const end = new Date(range.end);

        const filtered = borrowData.filter((b) => {
            const date = new Date(b.createdAt);
            return date >= start && date <= end;
        });

        // Group by day
        const daily: Record<string, { borrowCount: number; returnCount: number }> = {};
        filtered.forEach((b) => {
            const date = b.createdAt.split("T")[0];

            if (!daily[date]) {
                daily[date] = { borrowCount: 0, returnCount: 0 };
            }

            if (b.status === "borrowed") daily[date].borrowCount++;
            if (b.status === "returned") daily[date].returnCount++;
        });

        const dailyArr = Object.keys(daily).map((key, index) => ({
            id: index,
            date: key,
            ...daily[key],
        }));

        setReport({
            totalBorrowed: dailyArr.reduce((t, x) => t + x.borrowCount, 0),
            totalReturned: dailyArr.reduce((t, x) => t + x.returnCount, 0),
            daily: dailyArr,
        });
    };

    const handleExportPDF = () => {
        if (!report) return alert("Load report dulu");

        const newWindow = window.open("", "_blank");
        if (!newWindow) return alert("Popup diblokir!");

        const html = `
        <html>
        <head>
            <title>Library Report</title>
            <style>
                body { font-family: sans-serif; padding: 20px; }
                h1 { margin-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                th { background: #eee; }
            </style>
        </head>
        <body>
            <h1>Laporan Perpustakaan</h1>
            <p><strong>Range:</strong> ${range.start} → ${range.end}</p>

            <h3>Ringkasan</h3>
            <p><strong>Total Borrowed:</strong> ${report.totalBorrowed}</p>
            <p><strong>Total Returned:</strong> ${report.totalReturned}</p>

            <h3>Detail Harian</h3>
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Borrowed</th>
                        <th>Returned</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.daily
                        .map(
                            (r) =>
                                `<tr>
                                    <td>${r.date}</td>
                                    <td>${r.borrowCount}</td>
                                    <td>${r.returnCount}</td>
                                </tr>`
                        )
                        .join("")}
                </tbody>
            </table>

            <script>
                window.print();
            </script>
        </body>
        </html>
        `;

        newWindow.document.write(html);
        newWindow.document.close();
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Library Statistics</h2>

            {/* Summary */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h3 className="font-medium text-lg mb-3">Summary</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded">
                        <p className="text-sm text-gray-500">Borrowed</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {summary.borrowed}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-500">Returned</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {summary.returned}
                        </p>
                    </div>
                </div>
            </div>

            {/* Report */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-lg mb-3">Report</h3>

                <div className="flex gap-3 mb-4">
                    <input
                        type="date"
                        className="border rounded p-2"
                        value={range.start}
                        onChange={(e) =>
                            setRange({ ...range, start: e.target.value })
                        }
                    />
                    <input
                        type="date"
                        className="border rounded p-2"
                        value={range.end}
                        onChange={(e) =>
                            setRange({ ...range, end: e.target.value })
                        }
                    />
                    <button
                        onClick={loadReport}
                        className="px-4 py-2 bg-emerald-600 text-white rounded"
                    >
                        Load
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        Export PDF
                    </button>
                </div>

                {report && (
                    <div>
                        <p className="mb-2">
                            <strong>Total Borrowed:</strong> {report.totalBorrowed}
                        </p>
                        <p className="mb-4">
                            <strong>Total Returned:</strong> {report.totalReturned}
                        </p>

                        <h4 className="font-semibold mb-2">Daily Detail</h4>
                        <div className="border rounded">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Borrowed</th>
                                        <th className="p-2 text-left">Returned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.daily.map((r: DailyRecord) => (
                                        <tr key={r.id} className="border-t">
                                            <td className="p-2">{r.date}</td>
                                            <td className="p-2">{r.borrowCount}</td>
                                            <td className="p-2">{r.returnCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsPage;

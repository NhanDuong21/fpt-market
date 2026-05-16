export default function ProductStatusBadge({ status }) {
    const configs = {
        PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Approval' },
        APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
        REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
        SOLD: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sold' },
        HIDDEN: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Hidden' },
    };

    const config = configs[status] || configs.PENDING;

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}

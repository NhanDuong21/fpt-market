export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', type = 'danger' }) {
    if (!isOpen) return null;

    const colors = {
        danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
        primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 mb-8">{message}</p>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg ${colors[type]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

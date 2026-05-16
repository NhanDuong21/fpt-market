'use client';

export default function CategoryForm({ formData, setFormData, onSubmit, onCancel, loading, isEditing }) {
    return (
        <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Category' : 'New Category'}</h3>
            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all min-h-[100px]"
                    ></textarea>
                </div>
            </div>
            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}

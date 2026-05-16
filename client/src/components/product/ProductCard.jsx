import Link from 'next/link';

export default function ProductCard({ product }) {
    const { name, slug, price, conditionType, images, category } = product;
    const mainImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col h-full group">
            <Link href={`/products/${slug}`} className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={mainImage} 
                    alt={name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        conditionType === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                        {conditionType}
                    </span>
                </div>
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-[10px] text-red-600 font-black mb-1 uppercase tracking-[0.2em]">
                    {category?.name}
                </div>
                <Link href={`/products/${slug}`} className="text-gray-900 font-bold mb-2 line-clamp-2 hover:text-red-600 transition-colors leading-snug">
                    {name}
                </Link>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black text-red-600">
                        ${price.toLocaleString()}
                    </span>
                    <Link 
                        href={`/products/${slug}`}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:translate-x-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

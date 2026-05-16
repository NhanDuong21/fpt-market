'use client';

import HeroBanner from '@/components/home/HeroBanner';
import CategoryShortcutGrid from '@/components/home/CategoryShortcutGrid';
import TrustStrip from '@/components/home/TrustStrip';
import HomeProductSection from '@/components/home/HomeProductSection';
import HomeCtaSection from '@/components/home/HomeCtaSection';

export default function HomePage() {
    return (
        <div className="space-y-0">
            {/* Hero Section */}
            <HeroBanner />

            {/* Trust Highlights */}
            <TrustStrip />

            {/* Popular Categories */}
            <CategoryShortcutGrid />

            {/* Latest Products Section */}
            <HomeProductSection 
                title="Sản phẩm mới đăng" 
                subtitle="Những món đồ vừa được sinh viên FPT đăng bán"
                params={{ size: 8, sort: 'createdAt,desc' }}
            />

            {/* Textbooks Section */}
            <HomeProductSection 
                title="Giáo trình nổi bật" 
                subtitle="Tiết kiệm chi phí học tập với giáo trình cũ"
                params={{ size: 4, categoryId: 1, sort: 'createdAt,desc' }}
            />

            {/* CTA Section */}
            <HomeCtaSection />
        </div>
    );
}

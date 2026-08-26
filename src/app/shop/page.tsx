import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShopClient from './ShopClient';
import { db } from '@/lib/db';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await search params according to Next.js 16 guidelines
  const params = await searchParams;
  const initialCategory = typeof params.category === 'string' ? params.category : 'all';
  const initialSearch = typeof params.search === 'string' ? params.search : '';

  // Get initial products list
  const products = db.getProducts();

  // Get unique categories list
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <ShopClient
          initialProducts={products}
          categories={categories}
          initialCategory={initialCategory}
          initialSearch={initialSearch}
        />
      </main>
      <Footer />
    </div>
  );
}

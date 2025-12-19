'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetProductsQuery } from '@/src/store/api';
import { ProductCard } from '@/src/components/ProductCard';
import { ProductFilters } from '@/src/components/ProductFilters';
import type { ProductFilters as Filters } from '@/src/store/api';
import styles from './page.module.sass';

export default function Home() {
  const [filters, setFilters] = useState<Filters>({});
  const { data, isLoading, error } = useGetProductsQuery(filters, {
    refetchOnReconnect: true, // Refetch when reconnecting
    refetchOnMountOrArgChange: true, // Always refetch on mount or when args change
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Product Shop</h1>
          <Link href="/admin" className={styles.adminLink}>
            Admin Panel
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <ProductFilters onFilterChange={setFilters} />
        </aside>

        <div className={styles.content}>
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Failed to load products. Please check if the backend server is running.</p>
            </div>
          )}

          {data && data.products.length === 0 && (
            <div className={styles.empty}>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}

          {data && data.products.length > 0 && (
            <>
              <div className={styles.results}>
                <p>{data.total} products found</p>
              </div>
              <div className={styles.grid}>
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

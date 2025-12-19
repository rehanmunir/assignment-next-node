'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '@/src/store/api';
import { ProductCard } from '@/src/components/ProductCard';
import styles from './page.module.sass';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: product, isLoading, error } = useGetProductBySlugQuery(resolvedParams.slug, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { data: relatedProducts } = useGetRelatedProductsQuery(resolvedParams.slug, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.error}>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link href="/" className={styles.backLink}>
          Back to catalog
        </Link>
      </div>
    );
  }

  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.image}`;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{product.category}</span>
      </div>

      <div className={styles.product}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          </div>
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.price}>${product.price.toFixed(2)}</div>

          <div className={styles.availability}>
            {product.availability ? (
              <span className={styles.inStock}>In Stock</span>
            ) : (
              <span className={styles.outOfStock}>Out of Stock</span>
            )}
          </div>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Category:</span>
              <span className={styles.metaValue}>{product.category}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedTitle}>Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

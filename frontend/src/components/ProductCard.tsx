import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../store/api';
import styles from './ProductCard.module.sass';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image.startsWith('http')
    ? product.image
    : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.image}`;

  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
        {!product.availability && (
          <div className={styles.outOfStock}>Out of Stock</div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

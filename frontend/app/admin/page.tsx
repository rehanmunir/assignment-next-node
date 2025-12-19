'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  Product,
} from '@/src/store/api';
import { AddProductDialog } from '@/src/components/AddProductDialog';
import { UpdateProductDialog } from '@/src/components/UpdateProductDialog';
import styles from './page.module.sass';

export default function AdminPanel() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data, isLoading, error } = useGetProductsQuery({ limit: 100 });
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    // Check if admin is logged in
    const admin = localStorage.getItem('admin');
    setIsAuthenticated(!!admin);
    setIsChecking(false);
    if (!admin) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id.toString()).unwrap();
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateDialogOpen(true);
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error loading products</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Panel</h1>
          <div className={styles.headerActions}>
            <button onClick={() => router.push('/')} className={styles.viewSiteButton}>
              View Shop
            </button>
            <button onClick={() => setIsAddDialogOpen(true)} className={styles.addButton}>
              + Add Product
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{data?.total || 0}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {data?.products.filter((p) => p.availability).length || 0}
            </div>
            <div className={styles.statLabel}>In Stock</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {data?.products.filter((p) => !p.availability).length || 0}
            </div>
            <div className={styles.statLabel}>Out of Stock</div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products.map((product) => {
                const imageUrl = product.image.startsWith('http')
                  ? product.image
                  : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${product.image}`;

                return (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.imageCell}>
                        <Image
                          src={imageUrl}
                          alt={product.title}
                          width={60}
                          height={60}
                          className={styles.productImage}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.titleCell}>{product.title}</div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>{product.category}</span>
                    </td>
                    <td>
                      <span className={styles.price}>${product.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <span
                        className={product.availability ? styles.inStock : styles.outOfStock}
                      >
                        {product.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(product)}
                          className={styles.editButton}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {data?.products.length === 0 && (
            <div className={styles.empty}>
              <p>No products found. Add your first product!</p>
            </div>
          )}
        </div>
      </div>

      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      {selectedProduct && (
        <UpdateProductDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => {
            setIsUpdateDialogOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

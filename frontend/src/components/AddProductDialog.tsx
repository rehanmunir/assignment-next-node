'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateProductMutation } from '../store/api';
import styles from './AddProductDialog.module.sass';

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Clothing', 'Shoes', 'Electronics', 'Accessories', 'Home & Garden', 'Sports', 'Books', 'Toys'];

const productSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  category: Yup.string().required('Category is required').oneOf(CATEGORIES, 'Invalid category'),
  price: Yup.number().required('Price is required').positive('Price must be positive').min(0.01, 'Price must be at least 0.01'),
  availability: Yup.boolean().required(),
  image: Yup.mixed().required('Image is required'),
});

export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('price', values.price.toString());
      formData.append('availability', values.availability.toString());
      formData.append('image', values.image);

      await createProduct(formData).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add New Product</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <Formik
          initialValues={{
            title: '',
            description: '',
            category: '',
            price: '',
            availability: true,
            image: null,
          }}
          validationSchema={productSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Title *
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className={styles.input}
                  placeholder="Enter product title"
                />
                <ErrorMessage name="title" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image" className={styles.label}>
                  Image *
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFieldValue('image', file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className={styles.fileInput}
                />
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <ErrorMessage name="image" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category *
                </label>
                <Field as="select" id="category" name="category" className={styles.select}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Price *
                </label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  placeholder="0.00"
                />
                <ErrorMessage name="price" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <Field type="checkbox" name="availability" className={styles.checkbox} />
                  In Stock
                </label>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className={styles.textarea}
                  placeholder="Enter product description"
                />
                <ErrorMessage name="description" component="div" className={styles.error} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Slug (auto-generated from title)
                </label>
                <input
                  type="text"
                  value={values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                  disabled
                  className={`${styles.input} ${styles.disabled}`}
                />
              </div>

              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                  {isLoading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

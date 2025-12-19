'use client';

import { useState, useEffect } from 'react';
import { ProductFilters as Filters } from '../store/api';
import styles from './ProductFilters.module.sass';

interface ProductFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const CATEGORIES = ['Clothing', 'Shoes', 'Electronics', 'Accessories', 'Home & Garden', 'Sports', 'Books', 'Toys'];

export function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | ''>('');

  useEffect(() => {
    const filters: Filters = {};
    if (search) filters.search = search;
    if (selectedCategories.length > 0) filters.category = selectedCategories.join(',');
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (sortBy) filters.sortBy = sortBy;

    onFilterChange(filters);
  }, [search, selectedCategories, minPrice, maxPrice, sortBy, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Category</h3>
        <div className={styles.checkboxGroup}>
          {CATEGORIES.map((category) => (
            <label key={category} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className={styles.checkbox}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Price Range</h3>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.priceInput}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.priceInput}
            min="0"
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3 className={styles.filterTitle}>Sort by</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className={styles.select}
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, Grid, List, RefreshCw, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: string[];
  initialCategory: string;
  initialSearch: string;
}

export default function ShopClient({
  initialProducts,
  categories,
  initialCategory,
  initialSearch
}: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Store actions
  const { searchQuery, setSearchQuery } = useStore();

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchVal, setSearchVal] = useState(initialSearch || searchQuery);

  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Available Sizes and Colors based on product variants (statically listed for matches)
  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Crimson Red', hex: '#8B0000' },
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Terracotta', hex: '#D97D64' },
    { name: 'Cream', hex: '#FFFDD0' },
    { name: 'Sage Green', hex: '#87A987' },
    { name: 'Gold/Charcoal', hex: '#C5A059' },
    { name: 'Dusty Rose', hex: '#DCAE96' },
    { name: 'Bronze', hex: '#CD7F32' },
    { name: 'Charcoal', hex: '#2F4F4F' },
    { name: 'Mustard Gold', hex: '#E1AD01' },
    { name: 'Monochrome Print', hex: '#333333' }
  ];

  // Update component query when store changes search
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Sync parameters to URL for SEO/History
  const updateUrlParams = (category: string, search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Trigger simulated skeleton loading on filter changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSizes, selectedColors, minPrice, maxPrice, sortBy, searchVal]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateUrlParams(category, searchVal);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    updateUrlParams(selectedCategory, searchVal);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
    setSearchVal('');
    setSearchQuery('');
    router.replace(pathname);
  };

  // Filter logic on the client
  let filteredProducts = [...initialProducts];

  // 1. Category Filter
  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // 2. Search query Filter
  if (searchVal) {
    const term = searchVal.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }

  // 3. Price Filter
  if (minPrice !== '') {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice !== '') {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  // 4. Sizing Filter (Mock mapping check, sizes are verified at detail variant-level in backend)
  // For this grid view, we simulate matches, ensuring a highly functional demo
  if (selectedSizes.length > 0) {
    // Show products matching standard size availability mapping
    filteredProducts = filteredProducts.filter(p => {
      // Outwear & Casuals mapped to all, Dresses/Co-ords mapped to S/M/L
      if (selectedSizes.includes('XL') && p.category !== 'Outerwear') {
        return false;
      }
      return true;
    });
  }

  // 5. Color Filter simulation
  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter(p => {
      // Mock matches to keep display rich
      if (selectedColors.includes('Crimson Red') && p.slug !== 'modern-isi-agu-bomber-jacket') return false;
      if (selectedColors.includes('Royal Blue') && p.slug !== 'royal-aso-ebi-dinner-gown') return false;
      if (selectedColors.includes('Terracotta') && p.slug !== 'sleek-terracotta-kaftan-dress') return false;
      if (selectedColors.includes('Cream') && p.slug !== 'premium-tailored-wrap-dress') return false;
      if (selectedColors.includes('Sage Green') && p.slug !== 'contemporary-streetwear-kimono') return false;
      return true;
    });
  }

  // Sorting logic
  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name_asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (minPrice !== '' ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0) +
    (searchVal !== '' ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Search & Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">The Atelier Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {filteredProducts.length} premium apparel pieces
          </p>
        </div>

        {/* Catalog Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 border border-border bg-card rounded-md px-3.5 py-2 w-full md:max-w-md">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal('');
                setSearchQuery('');
                updateUrlParams(selectedCategory, '');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between py-4 border-b border-border text-sm">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden flex items-center space-x-2 border border-border bg-card hover:bg-muted py-2 px-4 rounded-md transition-colors"
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground font-bold h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <div className="hidden lg:flex items-center space-x-2">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          <span className="font-semibold text-muted-foreground">Filter Catalog:</span>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 text-xs text-primary hover:underline font-bold"
            >
              <span>Clear All ({activeFiltersCount})</span>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Sorting selection */}
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-1.5 text-foreground outline-none text-xs sm:text-sm"
          >
            <option value="featured">Atelier Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        
        {/* Sidebar Filters (Desktop & Mobile) */}
        <aside
          className={`lg:col-span-3 space-y-8 bg-background lg:block ${
            isSidebarOpen
              ? 'fixed inset-0 z-50 overflow-y-auto p-6 bg-background shadow-2xl w-80'
              : 'hidden'
          }`}
        >
          {/* Mobile Sidebar Close */}
          {isSidebarOpen && (
            <div className="flex justify-between items-center border-b border-border pb-4 mb-6 lg:hidden">
              <h2 className="text-lg font-bold text-foreground">Filter Catalog</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Categories</h3>
            <div className="flex flex-col space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left text-sm py-1.5 px-3 rounded-md transition-all font-medium uppercase tracking-wide text-xs ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sizing Filter */}
          <div className="space-y-3 pt-6 border-t border-border/60">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Select Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`h-10 w-10 border rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-card text-foreground hover:border-foreground'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="space-y-3 pt-6 border-t border-border/60">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Select Color</h3>
            <div className="grid grid-cols-2 gap-2">
              {colors.map((color) => {
                const isSelected = selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 border rounded-md text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-foreground font-bold'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-border/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] tracking-wide truncate">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 pt-6 border-t border-border/60">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Price Range ($)</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <span className="text-muted-foreground text-xs">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Reset button inside drawer */}
          {isSidebarOpen && (
            <button
              onClick={() => {
                handleClearFilters();
                setIsSidebarOpen(false);
              }}
              className="w-full bg-muted border border-border text-foreground hover:bg-foreground hover:text-background py-3 rounded-md font-semibold text-sm transition-all"
            >
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Product Catalog Grid (Desktop content) */}
        <div className="lg:col-span-9">
          {loading ? (
            /* Skeleton Loading Grid Display */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[3/4] w-full bg-muted rounded-md notched-card" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Catalog Empty State Display */
            <div className="flex flex-col items-center justify-center text-center py-20 px-4 space-y-5 bg-card border border-border rounded-lg max-w-xl mx-auto notched-card mt-10">
              <div className="p-4 bg-muted rounded-full">
                <RefreshCw size={36} className="text-muted-foreground/60" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">No Products Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                We couldn't find any products matching your selected search query or combination of filters. Try widening your criteria!
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-2.5 rounded-md text-sm transition-colors shadow-sm"
              >
                Clear All Filters & Reset
              </button>
            </div>
          ) : (
            /* Real Products Catalog Display */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block space-y-3"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-md border border-border bg-muted relative notched-card">
                    <img
                      src={`/images/${product.images}`}
                      alt={product.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm border border-border py-2 px-3 rounded-md text-xs font-bold text-primary shadow-sm">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-primary">{product.category}</p>
                    <h3 className="font-serif text-md font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

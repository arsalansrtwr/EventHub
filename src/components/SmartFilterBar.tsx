import React from 'react';
import { Category, FilterOptions } from '../types';

interface SmartFilterBarProps {
  categories: Category[];
  cities: string[];
  filters: FilterOptions;
  onFilterChange: (updates: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const SmartFilterBar: React.FC<SmartFilterBarProps> = ({
  categories,
  cities,
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const isFiltered =
    filters.categoryId !== 'all' ||
    filters.city !== 'all' ||
    filters.language !== 'all' ||
    filters.ageLimit !== 'all' ||
    filters.maxPrice < 25000 ||
    filters.search !== '';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      {/* Integrated Multi-Parameter Filter Matrix */}
      <div className="w-full bg-white rounded-2xl shadow-xs p-4 sm:p-6 flex flex-col gap-4 border border-slate-200">
        {/* Top 12-Column Search & Select Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Term Input (5 cols) */}
          <div className="lg:col-span-5 flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2 shrink-0">search</span>
            <input
              type="text"
              id="searchInput"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Search by artist, title, venue, or stadium..."
              className="bg-transparent w-full text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="text-xs text-slate-400 hover:text-slate-600 ml-1 p-0.5"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* City / Venue Select (3 cols) */}
          <div className="lg:col-span-3 flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2 shrink-0">location_on</span>
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="bg-transparent w-full text-slate-900 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Pakistan Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Language select (2 cols) */}
          <div className="lg:col-span-2 flex items-center bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
            <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2 shrink-0">translate</span>
            <select
              value={filters.language}
              onChange={(e) => onFilterChange({ language: e.target.value })}
              className="bg-transparent w-full text-slate-900 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="Urdu">Urdu</option>
              <option value="English">English</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Sindhi">Sindhi</option>
            </select>
          </div>

          {/* Action / Reset Button (2 cols) */}
          <div className="lg:col-span-2 flex h-full">
            {isFiltered ? (
              <button
                onClick={onResetFilters}
                className="w-full min-h-[42px] bg-slate-100 hover:bg-rose-50 text-rose-600 border border-rose-200/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset Filters</span>
              </button>
            ) : (
              <button
                onClick={() => onFilterChange({})}
                className="w-full min-h-[42px] bg-primary hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Find Passes</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Category Pills & Price Slider */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none" id="categoryGroup">
            <button
              onClick={() => onFilterChange({ categoryId: 'all' })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filters.categoryId === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isActive = filters.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onFilterChange({ categoryId: cat.id })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Price Range Slider in PKR */}
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full whitespace-nowrap self-stretch sm:self-auto justify-between sm:justify-start">
            <span className="text-xs text-slate-500 font-medium">
              Max: <strong className="text-slate-900 font-mono-numbers">Rs. {filters.maxPrice.toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-24 sm:w-28 accent-primary cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Sorting and Results Counter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-lg font-bold text-slate-900 font-display">Live Box Office Listings</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-xs font-bold font-mono-numbers">
            {totalResultsCount} verified events
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="text-xs text-slate-400 whitespace-nowrap font-medium">Sort by:</label>
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-2xs border border-slate-200 flex items-center gap-1.5">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="date_asc">Event Date (Soonest)</option>
              <option value="price_asc">Ticket Price: Low to High</option>
              <option value="price_desc">Ticket Price: High to Low</option>
              <option value="date_desc">Event Date (Latest)</option>
            </select>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">unfold_more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

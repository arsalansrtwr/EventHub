import React from 'react';
import { Category } from '../types';
import { Music, Cpu, Sparkles, Trophy, BookOpen, Mic, Tag, ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
  categories: (Category & { eventCount: number })[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'music':
        return <Music className="w-5 h-5 text-indigo-600" />;
      case 'tech':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'arts':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'sports':
        return <Trophy className="w-5 h-5 text-indigo-600" />;
      case 'workshops':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'comedy':
        return <Mic className="w-5 h-5 text-indigo-600" />;
      default:
        return <Tag className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <section id="categories" className="py-12 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Browse by Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated experiences organized by discipline, from grand stages to intimate salons.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-indigo-50/80 w-fit mb-3 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono-numbers mt-0.5">
                    {cat.eventCount} event{cat.eventCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

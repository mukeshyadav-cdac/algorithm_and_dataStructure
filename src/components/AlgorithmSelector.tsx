import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, BookOpen, Star, Zap } from 'lucide-react';
import { Algorithm, AlgorithmCategory } from '../types';
import { Card, CardHeader, CardContent } from './ui/Card';
import Button from './ui/Button';
import Badge, { DifficultyBadge, ComplexityBadge } from './ui/Badge';

/**
 * Enhanced Algorithm Selector with Beautiful Design
 * Composition Pattern: Separates display logic from data logic
 */

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  categories: AlgorithmCategory[];
  selectedAlgorithm?: Algorithm;
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  className?: string;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  categories,
  selectedAlgorithm,
  onAlgorithmSelect,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter algorithms based on current filters
  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter(algorithm => {
      // Category filter
      if (selectedCategory && algorithm.category.id !== selectedCategory) {
        return false;
      }
      
      // Difficulty filter
      if (difficultyFilter && algorithm.difficulty !== difficultyFilter) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          algorithm.name.toLowerCase().includes(query) ||
          algorithm.education.overview.toLowerCase().includes(query) ||
          algorithm.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [algorithms, selectedCategory, difficultyFilter, searchQuery]);

  // Group algorithms by category for display
  const algorithmsByCategory = useMemo(() => {
    const grouped = new Map<string, Algorithm[]>();
    
    filteredAlgorithms.forEach(algorithm => {
      const categoryId = algorithm.category.id;
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(algorithm);
    });
    
    return grouped;
  }, [filteredAlgorithms]);

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
    }
  };

  const AlgorithmCard: React.FC<{ algorithm: Algorithm }> = ({ algorithm }) => (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
        selectedAlgorithm?.id === algorithm.id
          ? `border-gradient-to-r ${algorithm.category.gradient} bg-gradient-to-r ${algorithm.category.gradient} bg-opacity-10`
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={() => onAlgorithmSelect(algorithm)}
    >
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${algorithm.category.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative p-4">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${algorithm.category.gradient} text-white shadow-sm`}>
            {algorithm.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors leading-tight">
              {algorithm.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {algorithm.category.name}
            </p>
          </div>
          {selectedAlgorithm?.id === algorithm.id && (
            <div className="text-blue-500">
              <Star className="h-5 w-5 fill-current" />
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {algorithm.education.overview.slice(0, 120)}...
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {algorithm.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={algorithm.difficulty} />
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{algorithm.estimatedTimeMinutes}min</span>
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400">
            {algorithm.education.timeComplexity.average}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`h-full ${className}`}>
      {/* Header with search and filters */}
      <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Algorithms</h2>
            <p className="text-gray-600 mt-1">
              {filteredAlgorithms.length} of {algorithms.length} algorithms
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {/* Search bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedCategory === null ? "primary" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    size="sm"
                    variant={selectedCategory === category.id ? "primary" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-1"
                  >
                    {category.icon}
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Difficulty filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={difficultyFilter === null ? "primary" : "outline"}
                  onClick={() => setDifficultyFilter(null)}
                >
                  All
                </Button>
                {['easy', 'medium', 'hard'].map(difficulty => (
                  <Button
                    key={difficulty}
                    size="sm"
                    variant={difficultyFilter === difficulty ? "primary" : "outline"}
                    onClick={() => setDifficultyFilter(difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      {/* Algorithm list */}
      <CardContent className="p-0">
        <div className="h-[600px] overflow-y-auto">
          {algorithmsByCategory.size === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BookOpen className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No algorithms found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {categories
                .filter(category => algorithmsByCategory.has(category.id))
                .map(category => (
                  <div key={category.id}>
                    {/* Category header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient} text-white`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    
                    {/* Algorithms in this category */}
                    <div className="grid gap-4">
                      {algorithmsByCategory.get(category.id)!.map(algorithm => (
                        <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmSelector;
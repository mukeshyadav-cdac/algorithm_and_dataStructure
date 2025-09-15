import React, { useState } from 'react';
import { Search, Filter, BookOpen, Clock, BarChart3 } from 'lucide-react';
import type { Algorithm, AlgorithmCategory } from '@/types';
import { Card, CardHeader, CardContent, Button, Badge, DifficultyBadge, ComplexityBadge, Input } from '@/components/ui';

/**
 * Algorithm Selector Props following ISP
 * ISP: Separates selection logic from display configuration
 */
interface BaseAlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedAlgorithm?: Algorithm;
  onAlgorithmSelect: (algorithm: Algorithm) => void;
}

interface FilterableAlgorithmSelectorProps extends BaseAlgorithmSelectorProps {
  categories?: AlgorithmCategory[];
  showCategories?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
}

interface LayoutAlgorithmSelectorProps extends FilterableAlgorithmSelectorProps {
  layout?: 'grid' | 'list';
  className?: string;
}

export interface AlgorithmSelectorProps extends LayoutAlgorithmSelectorProps {}

/**
 * Algorithm Card Component
 * Single Responsibility: Displays individual algorithm information
 */
interface AlgorithmCardProps {
  algorithm: Algorithm;
  isSelected?: boolean;
  onSelect: (algorithm: Algorithm) => void;
  layout?: 'grid' | 'list';
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  algorithm,
  isSelected = false,
  onSelect,
  layout = 'grid',
}) => {
  const IconComponent = algorithm.icon;

  const handleSelect = () => {
    onSelect(algorithm);
  };

  const cardVariant = isSelected ? 'elevated' : 'default';
  const cardClasses = `
    ${isSelected ? 'ring-2 ring-blue-500' : ''}
    ${layout === 'list' ? 'mb-3' : ''}
  `;

  const contentLayout = layout === 'list' 
    ? 'flex items-center space-x-4'
    : 'text-center';

  const iconSize = layout === 'list' ? 'h-8 w-8' : 'h-12 w-12';

  return (
    <Card 
      variant={cardVariant}
      hoverable
      onClick={handleSelect}
      className={cardClasses}
    >
      <CardContent className="p-4">
        <div className={contentLayout}>
          {/* Algorithm Icon */}
          <div className={`${layout === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
              <IconComponent className={`${iconSize} text-blue-600`} />
            </div>
          </div>

          {/* Algorithm Info */}
          <div className={`${layout === 'list' ? 'flex-1 min-w-0' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {algorithm.name}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {algorithm.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-3">
              <DifficultyBadge difficulty={algorithm.difficulty} />
              <Badge variant="secondary" size="sm">
                {algorithm.category.replace('_', ' ')}
              </Badge>
              <Badge variant="info" size="sm" dot>
                {algorithm.solutions.length} solutions
              </Badge>
            </div>

            {/* Time Estimate */}
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>~{algorithm.estimatedTime}min</span>
            </div>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Category Filter Component
 * Single Responsibility: Handles category-based filtering
 */
interface CategoryFilterProps {
  categories: AlgorithmCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onCategorySelect(null)}
      >
        All Categories
      </Button>
      
      {categories.map(category => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect(category.id)}
            className="flex items-center gap-1"
          >
            <IconComponent className="h-4 w-4" />
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};

/**
 * Algorithm Stats Summary
 * Single Responsibility: Shows algorithm collection statistics
 */
interface StatsProps {
  algorithms: Algorithm[];
  filteredCount: number;
}

const AlgorithmStats: React.FC<StatsProps> = ({ algorithms, filteredCount }) => {
  const stats = React.useMemo(() => {
    const totalSolutions = algorithms.reduce((sum, alg) => sum + alg.solutions.length, 0);
    const avgTime = algorithms.reduce((sum, alg) => sum + alg.estimatedTime, 0) / algorithms.length;
    
    const difficultyCounts = algorithms.reduce((acc, alg) => {
      acc[alg.difficulty] = (acc[alg.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSolutions,
      avgTime: Math.round(avgTime),
      difficultyCounts,
    };
  }, [algorithms]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{filteredCount}</div>
        <div className="text-sm text-gray-600">Algorithms</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{stats.totalSolutions}</div>
        <div className="text-sm text-gray-600">Solutions</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">{stats.avgTime}min</div>
        <div className="text-sm text-gray-600">Avg Time</div>
      </div>
      
      <div className="text-center">
        <div className="flex justify-center gap-1">
          {Object.entries(stats.difficultyCounts).map(([difficulty, count]) => (
            <Badge key={difficulty} variant="outline" size="sm">
              {difficulty}: {count}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-gray-600 mt-1">Difficulty</div>
      </div>
    </div>
  );
};

/**
 * Main Algorithm Selector Component
 * Template Method Pattern: Defines selection workflow with customizable filtering
 */
const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmSelect,
  categories = [],
  showCategories = true,
  showSearch = true,
  showFilters = true,
  layout = 'grid',
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'time'>('name');

  // Filter and sort algorithms
  const filteredAlgorithms = React.useMemo(() => {
    let filtered = algorithms;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alg =>
        alg.name.toLowerCase().includes(query) ||
        alg.description.toLowerCase().includes(query) ||
        alg.tags.some(tag => tag.toLowerCase().includes(query)) ||
        alg.concepts.some(concept => concept.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(alg => alg.category === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'time':
          return a.estimatedTime - b.estimatedTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [algorithms, searchQuery, selectedCategory, sortBy]);

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    : 'space-y-3';

  return (
    <div className={`algorithm-selector ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Choose an Algorithm
        </h2>
        <p className="text-gray-600">
          Select an algorithm to explore different solution approaches and visualizations
        </p>
      </div>

      {/* Stats Summary */}
      <AlgorithmStats 
        algorithms={algorithms} 
        filteredCount={filteredAlgorithms.length} 
      />

      {/* Controls */}
      <div className="space-y-4 my-6">
        {/* Search */}
        {showSearch && (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search algorithms, concepts, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={Search}
              />
            </div>
            
            {showFilters && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'difficulty' | 'time')}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="time">Sort by Time</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        {showCategories && categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        )}
      </div>

      {/* Results */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredAlgorithms.length} algorithm{filteredAlgorithms.length !== 1 ? 's' : ''} found
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
          >
            <BarChart3 className="h-4 w-4" />
            {layout === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* Algorithm Grid/List */}
      {filteredAlgorithms.length > 0 ? (
        <div className={gridClasses}>
          {filteredAlgorithms.map(algorithm => (
            <AlgorithmCard
              key={algorithm.id}
              algorithm={algorithm}
              isSelected={selectedAlgorithm?.id === algorithm.id}
              onSelect={onAlgorithmSelect}
              layout={layout}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No algorithms found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your search criteria or category filter
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmSelector;

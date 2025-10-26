import React from 'react';
import { BookOpen, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  coursesCount: number;
}

const tabs = [
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'skills', label: 'Skills Gap', icon: TrendingUp },
  { id: 'metrics', label: 'Metrics', icon: BarChart3 },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, coursesCount }) => {
  return (
    <div className="border-b border-secondary-200 dark:border-secondary-700 mb-8">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-600'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'courses' && coursesCount > 0 && (
              <span className="ml-1 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                {coursesCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WordCounterProps {
  className?: string;
}

const WordCounter: React.FC<WordCounterProps> = ({ className = '' }) => {
  const [remainingWords, setRemainingWords] = useState(200000);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call to refresh word count
    setTimeout(() => {
      // In real implementation, this would fetch from server
      setRemainingWords(200000 - Math.floor(Math.random() * 50000));
      setIsRefreshing(false);
    }, 1500);
  };

  const formatWordCount = (count: number) => {
    if (count >= 10000) {
      return Math.floor(count);
    }
    return count.toLocaleString();
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600">
        剩余{formatWordCount(remainingWords)}字
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-6 w-6 p-0 hover:bg-gray-100"
      >
        <RefreshCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default WordCounter;

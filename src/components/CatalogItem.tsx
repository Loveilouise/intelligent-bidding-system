
import React from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CatalogItem as CatalogItemType } from '@/types/bid';

interface CatalogItemProps {
  item: CatalogItemType;
  parentId?: string | null;
  batchMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (itemId: string, checked: boolean) => void;
  onToggleExpansion: (itemId: string) => void;
  onAddSameLevel: (parentId: string | null, afterId: string) => void;
  onAddSubLevel: (parentId: string) => void;
  onDelete: (itemId: string) => void;
  onDoubleClick?: (itemId: string, title: string) => void;
  onWordCountSetting?: (itemId: string, currentCount: number) => void;
  editingItem?: string | null;
  editingText?: string;
  setEditingText?: (text: string) => void;
  onSaveEdit?: () => void;
  showWordCount?: boolean;
}

const CatalogItem: React.FC<CatalogItemProps> = ({
  item,
  parentId = null,
  batchMode = false,
  isSelected = false,
  onToggleSelect,
  onToggleExpansion,
  onAddSameLevel,
  onAddSubLevel,
  onDelete,
  onDoubleClick,
  onWordCountSetting,
  editingItem,
  editingText,
  setEditingText,
  onSaveEdit,
  showWordCount = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSaveEdit) {
      onSaveEdit();
    }
  };

  return (
    <div className="group">
      <div 
        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
        style={{ paddingLeft: `${item.level * 16 + 8}px` }}
      >
        <div className="flex items-center flex-1">
          {batchMode && onToggleSelect && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onToggleSelect(item.id, checked as boolean)}
              className="mr-2 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
            />
          )}
          
          {item.children && item.children.length > 0 && (
            <button
              onClick={() => onToggleExpansion(item.id)}
              className="mr-2 p-0.5 hover:bg-gray-200 rounded"
            >
              {item.expanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {editingItem === item.id ? (
            <Input
              value={editingText}
              onChange={(e) => setEditingText && setEditingText(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={onSaveEdit}
              className="h-6 text-sm border-sky-600 focus:border-sky-600"
              autoFocus
            />
          ) : (
            <span 
              className="text-sm flex-1"
              onDoubleClick={() => onDoubleClick && onDoubleClick(item.id, item.title)}
            >
              {item.title}
            </span>
          )}
          
          {showWordCount && (
            <span className="text-xs text-gray-500 ml-2">
              {item.wordCount || 1000}字
            </span>
          )}
        </div>
        
        {!batchMode && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {showWordCount && onWordCountSetting && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => onWordCountSetting(item.id, item.wordCount || 1000)}
                    >
                      <Settings2 className="h-3 w-3 text-black" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>字数设置</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3 text-black" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white border border-gray-200 shadow-lg p-0 z-50">
                    <div className="flex flex-col min-w-32">
                      <button
                        className="px-3 py-2 text-sm hover:bg-gray-50 text-left text-black whitespace-nowrap"
                        onClick={() => onAddSameLevel(parentId, item.id)}
                      >
                        创建同级章节
                      </button>
                      <button
                        className="px-3 py-2 text-sm hover:bg-gray-50 text-left text-black whitespace-nowrap"
                        onClick={() => onAddSubLevel(item.id)}
                      >
                        创建子级章节
                      </button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Trash2 className="h-3 w-3 text-black" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要删除"{item.title}"吗？此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id)}>删除</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      {item.expanded && item.children && item.children.map(child => (
        <CatalogItem
          key={child.id}
          item={child}
          parentId={item.id}
          batchMode={batchMode}
          isSelected={onToggleSelect ? isSelected : false}
          onToggleSelect={onToggleSelect}
          onToggleExpansion={onToggleExpansion}
          onAddSameLevel={onAddSameLevel}
          onAddSubLevel={onAddSubLevel}
          onDelete={onDelete}
          onDoubleClick={onDoubleClick}
          onWordCountSetting={onWordCountSetting}
          editingItem={editingItem}
          editingText={editingText}
          setEditingText={setEditingText}
          onSaveEdit={onSaveEdit}
          showWordCount={showWordCount}
        />
      ))}
    </div>
  );
};

export default CatalogItem;

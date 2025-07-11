
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OutlineItem {
  id: string;
  title: string;
  level: number;
  expanded?: boolean;
  children?: OutlineItem[];
}

interface OutlineEditorProps {
  selectedOutlineItem: string;
  setSelectedOutlineItem: (id: string) => void;
}

const OutlineEditor: React.FC<OutlineEditorProps> = ({
  selectedOutlineItem,
  setSelectedOutlineItem
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Mock outline data
  const [businessOutline, setBusinessOutline] = useState<OutlineItem[]>([
    {
      id: '1',
      title: '投标函',
      level: 1,
      expanded: true,
      children: [
        { id: '1-1', title: '投标承诺', level: 2 },
        { id: '1-2', title: '投标报价', level: 2 }
      ]
    },
    {
      id: '2',
      title: '法定代表人身份证明',
      level: 1
    },
    {
      id: '3',
      title: '授权委托书',
      level: 1
    },
    {
      id: '4',
      title: '企业资质证明',
      level: 1,
      expanded: true,
      children: [
        { id: '4-1', title: '营业执照', level: 2 },
        { id: '4-2', title: '资质证书', level: 2 }
      ]
    }
  ]);

  const toggleExpand = (itemId: string) => {
    const updateItem = (items: OutlineItem[]): OutlineItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, expanded: !item.expanded };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };
    setBusinessOutline(updateItem(businessOutline));
  };

  const startEdit = (itemId: string, currentTitle: string) => {
    setEditingItem(itemId);
    setEditingText(currentTitle);
  };

  const saveEdit = () => {
    if (editingItem && editingText.trim()) {
      const updateItem = (items: OutlineItem[]): OutlineItem[] => {
        return items.map(item => {
          if (item.id === editingItem) {
            return { ...item, title: editingText.trim() };
          }
          if (item.children) {
            return { ...item, children: updateItem(item.children) };
          }
          return item;
        });
      };
      setBusinessOutline(updateItem(businessOutline));
    }
    setEditingItem(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditingText('');
  };

  const addSameLevel = (parentId: string | null, afterId: string) => {
    const newId = `new-${Date.now()}`;
    const newItem: OutlineItem = {
      id: newId,
      title: '新章节',
      level: parentId ? 2 : 1
    };
    
    // Implementation would add item at same level
    console.log('添加同级章节', { parentId, afterId, newItem });
  };

  const addSubLevel = (parentId: string) => {
    const newId = `new-${Date.now()}`;
    const newItem: OutlineItem = {
      id: newId,
      title: '新子章节',
      level: 2
    };
    
    // Implementation would add item as child
    console.log('添加子级章节', { parentId, newItem });
  };

  const deleteItem = (itemId: string) => {
    const removeItem = (items: OutlineItem[]): OutlineItem[] => {
      return items.filter(item => {
        if (item.id === itemId) {
          return false;
        }
        if (item.children) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };
    setBusinessOutline(removeItem(businessOutline));
  };

  const renderOutlineItem = (item: OutlineItem) => (
    <div key={item.id} className="group">
      <div
        className={`flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm ${
          selectedOutlineItem === item.id ? 'bg-sky-50 text-sky-700 border-l-2 border-sky-600' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${item.level * 12 + 8}px` }}
        onClick={() => setSelectedOutlineItem(item.id)}
      >
        <div className="flex items-center flex-1">
          {item.children && item.children.length > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {item.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          
          {editingItem === item.id ? (
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
              onBlur={saveEdit}
              className="h-6 text-sm"
              autoFocus
            />
          ) : (
            <span className="flex-1">{item.title}</span>
          )}
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-white border border-gray-200 shadow-lg p-0">
                <div className="flex flex-col min-w-32">
                  <button
                    className="px-3 py-2 text-sm hover:bg-gray-50 text-left"
                    onClick={(e) => { e.stopPropagation(); addSameLevel(null, item.id); }}
                  >
                    创建同级章节
                  </button>
                  <button
                    className="px-3 py-2 text-sm hover:bg-gray-50 text-left"
                    onClick={(e) => { e.stopPropagation(); addSubLevel(item.id); }}
                  >
                    创建子级章节
                  </button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => { e.stopPropagation(); startEdit(item.id, item.title); }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Trash2 className="h-3 w-3" />
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
                <AlertDialogAction onClick={() => deleteItem(item.id)}>删除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {item.expanded && item.children && (
        <div>
          {item.children.map(child => renderOutlineItem(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h4 className="font-medium text-gray-900">目录</h4>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {businessOutline.map(item => renderOutlineItem(item))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OutlineEditor;

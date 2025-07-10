
import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronRight, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CatalogItem from './CatalogItem';
import { CatalogItem as CatalogItemType } from '@/types/bid';

interface BidGenerationProps {
  generationStatus: 'idle' | 'generating' | 'completed';
  catalogType: 'business' | 'technical';
  setCatalogType: (type: 'business' | 'technical') => void;
  catalogExpanded: boolean;
  setCatalogExpanded: (expanded: boolean) => void;
  rightPanelTab: 'requirements' | 'information';
  setRightPanelTab: (tab: 'requirements' | 'information') => void;
  catalogItems: CatalogItemType[];
  setCatalogItems: (items: CatalogItemType[]) => void;
  onRegenerateCatalog: () => void;
}

const BidGeneration: React.FC<BidGenerationProps> = ({
  generationStatus,
  catalogItems,
  setCatalogItems,
  onRegenerateCatalog
}) => {
  const [businessBatchMode, setBusinessBatchMode] = useState(false);
  const [technicalBatchMode, setTechnicalBatchMode] = useState(false);
  const [businessSelectedItems, setBusinessSelectedItems] = useState<Set<string>>(new Set());
  const [technicalSelectedItems, setTechnicalSelectedItems] = useState<Set<string>>(new Set());
  const [businessSelectAll, setBusinessSelectAll] = useState(false);
  const [technicalSelectAll, setTechnicalSelectAll] = useState(false);
  const [businessExpanded, setBusinessExpanded] = useState(true);
  const [technicalExpanded, setTechnicalExpanded] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [wordCountDialogOpen, setWordCountDialogOpen] = useState(false);
  const [editingWordCount, setEditingWordCount] = useState('');
  const [currentWordCountItem, setCurrentWordCountItem] = useState<string | null>(null);

  // Sample data - separate catalogs for business and technical
  const [businessCatalogItems, setBusinessCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: 'b1', 
      title: '投标函', 
      level: 1,
      expanded: true,
      wordCount: 1000,
      children: [
        { id: 'b1-1', title: '投标函', level: 2, wordCount: 500 },
        { id: 'b1-2', title: '法定代表人身份证明', level: 2, wordCount: 300 },
        { id: 'b1-3', title: '授权委托书', level: 2, wordCount: 200 }
      ]
    },
    { id: 'b2', title: '资质证明文件', level: 1, expanded: true, wordCount: 800 },
    { id: 'b3', title: '财务状况报告', level: 1, expanded: true, wordCount: 1200 }
  ]);

  const [technicalCatalogItems, setTechnicalCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: 't1', 
      title: '技术方案', 
      level: 1,
      expanded: true,
      wordCount: 2000,
      children: [
        { id: 't1-1', title: '总体技术方案', level: 2, wordCount: 1000 },
        { id: 't1-2', title: '技术路线', level: 2, wordCount: 800 },
        { id: 't1-3', title: '关键技术', level: 2, wordCount: 1200 }
      ]
    },
    { id: 't2', title: '项目组织架构', level: 1, expanded: true, wordCount: 1500 },
    { id: 't3', title: '进度计划', level: 1, expanded: true, wordCount: 1000 },
    { id: 't4', title: '质量保证措施', level: 1, expanded: true, wordCount: 1800 }
  ]);

  const calculateTotalWordCount = (items: CatalogItemType[]): number => {
    return items.reduce((total, item) => {
      let itemTotal = item.wordCount || 1000;
      if (item.children) {
        itemTotal += calculateTotalWordCount(item.children);
      }
      return total + itemTotal;
    }, 0);
  };

  const handleBusinessBatchMode = () => {
    setBusinessBatchMode(true);
    setBusinessSelectedItems(new Set());
    setBusinessSelectAll(false);
  };

  const handleTechnicalBatchMode = () => {
    setTechnicalBatchMode(true);
    setTechnicalSelectedItems(new Set());
    setTechnicalSelectAll(false);
  };

  const handleBusinessCancelBatch = () => {
    setBusinessBatchMode(false);
    setBusinessSelectedItems(new Set());
    setBusinessSelectAll(false);
  };

  const handleTechnicalCancelBatch = () => {
    setTechnicalBatchMode(false);
    setTechnicalSelectedItems(new Set());
    setTechnicalSelectAll(false);
  };

  const handleDoubleClick = (itemId: string, title: string) => {
    setEditingItem(itemId);
    setEditingText(title);
  };

  const handleSaveEdit = () => {
    if (editingItem && editingText.trim()) {
      // Update business catalog
      const updateBusinessItems = (items: CatalogItemType[]): CatalogItemType[] => {
        return items.map(item => {
          if (item.id === editingItem) {
            return { ...item, title: editingText.trim() };
          }
          if (item.children) {
            return { ...item, children: updateBusinessItems(item.children) };
          }
          return item;
        });
      };

      // Update technical catalog
      const updateTechnicalItems = (items: CatalogItemType[]): CatalogItemType[] => {
        return items.map(item => {
          if (item.id === editingItem) {
            return { ...item, title: editingText.trim() };
          }
          if (item.children) {
            return { ...item, children: updateTechnicalItems(item.children) };
          }
          return item;
        });
      };

      setBusinessCatalogItems(updateBusinessItems(businessCatalogItems));
      setTechnicalCatalogItems(updateTechnicalItems(technicalCatalogItems));
    }
    setEditingItem(null);
    setEditingText('');
  };

  const handleWordCountSetting = (itemId: string, currentCount: number) => {
    setCurrentWordCountItem(itemId);
    setEditingWordCount(currentCount.toString());
    setWordCountDialogOpen(true);
  };

  const handleSaveWordCount = () => {
    if (currentWordCountItem && editingWordCount) {
      const newCount = parseInt(editingWordCount);
      if (newCount >= 1 && newCount <= 10000) {
        // Update business catalog
        const updateBusinessWordCount = (items: CatalogItemType[]): CatalogItemType[] => {
          return items.map(item => {
            if (item.id === currentWordCountItem) {
              return { ...item, wordCount: newCount };
            }
            if (item.children) {
              return { ...item, children: updateBusinessWordCount(item.children) };
            }
            return item;
          });
        };

        // Update technical catalog
        const updateTechnicalWordCount = (items: CatalogItemType[]): CatalogItemType[] => {
          return items.map(item => {
            if (item.id === currentWordCountItem) {
              return { ...item, wordCount: newCount };
            }
            if (item.children) {
              return { ...item, children: updateTechnicalWordCount(item.children) };
            }
            return item;
          });
        };

        setBusinessCatalogItems(updateBusinessWordCount(businessCatalogItems));
        setTechnicalCatalogItems(updateTechnicalWordCount(technicalCatalogItems));
      }
    }
    setWordCountDialogOpen(false);
    setCurrentWordCountItem(null);
    setEditingWordCount('');
  };

  if (generationStatus === 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">正在生成标书目录...</h3>
        <p className="text-gray-600">AI正在分析您的需求和上传的文件，请稍候</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 h-[600px]">
      {/* 商务标 */}
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">商务标</h3>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setBusinessExpanded(!businessExpanded)}>
              {businessExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
          
          {!businessBatchMode ? (
            <div className="flex items-center space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新生成
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重新生成</AlertDialogTitle>
                    <AlertDialogDescription>
                      重新生成将覆盖当前目录，确定要继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={onRegenerateCatalog} className="bg-sky-600 hover:bg-sky-700">确认</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" size="sm" onClick={handleBusinessBatchMode}>
                批量操作
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="business-select-all"
                  checked={businessSelectAll}
                  onCheckedChange={setBusinessSelectAll}
                  className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                />
                <label htmlFor="business-select-all" className="text-sm">全选</label>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleBusinessCancelBatch}>
                取消
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {businessCatalogItems.map(item => (
              <CatalogItem
                key={item.id}
                item={item}
                batchMode={businessBatchMode}
                isSelected={businessSelectedItems.has(item.id)}
                onToggleSelect={() => {}}
                onToggleExpansion={(itemId) => {
                  const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
                    return items.map(item => {
                      if (item.id === itemId) {
                        return { ...item, expanded: !item.expanded };
                      }
                      if (item.children) {
                        return { ...item, children: updateItems(item.children) };
                      }
                      return item;
                    });
                  };
                  setBusinessCatalogItems(updateItems(businessCatalogItems));
                }}
                onAddSameLevel={() => {}}
                onAddSubLevel={() => {}}
                onDelete={() => {}}
                onDoubleClick={handleDoubleClick}
                onWordCountSetting={handleWordCountSetting}
                editingItem={editingItem}
                editingText={editingText}
                setEditingText={setEditingText}
                onSaveEdit={handleSaveEdit}
                showWordCount={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 技术标 */}
      <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">技术标</h3>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setTechnicalExpanded(!technicalExpanded)}>
              {technicalExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-gray-600">
              预计生成字数：{calculateTotalWordCount(technicalCatalogItems)}
            </span>
          </div>
          
          {!technicalBatchMode ? (
            <div className="flex items-center space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    重新生成
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认重新生成</AlertDialogTitle>
                    <AlertDialogDescription>
                      重新生成将覆盖当前目录，确定要继续吗？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={onRegenerateCatalog} className="bg-sky-600 hover:bg-sky-700">确认</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" size="sm" onClick={handleTechnicalBatchMode}>
                批量操作
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technical-select-all"
                  checked={technicalSelectAll}
                  onCheckedChange={setTechnicalSelectAll}
                  className="data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                />
                <label htmlFor="technical-select-all" className="text-sm">全选</label>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleTechnicalCancelBatch}>
                取消
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {technicalCatalogItems.map(item => (
              <CatalogItem
                key={item.id}
                item={item}
                batchMode={technicalBatchMode}
                isSelected={technicalSelectedItems.has(item.id)}
                onToggleSelect={() => {}}
                onToggleExpansion={(itemId) => {
                  const updateItems = (items: CatalogItemType[]): CatalogItemType[] => {
                    return items.map(item => {
                      if (item.id === itemId) {
                        return { ...item, expanded: !item.expanded };
                      }
                      if (item.children) {
                        return { ...item, children: updateItems(item.children) };
                      }
                      return item;
                    });
                  };
                  setTechnicalCatalogItems(updateItems(technicalCatalogItems));
                }}
                onAddSameLevel={() => {}}
                onAddSubLevel={() => {}}
                onDelete={() => {}}
                onDoubleClick={handleDoubleClick}
                onWordCountSetting={handleWordCountSetting}
                editingItem={editingItem}
                editingText={editingText}
                setEditingText={setEditingText}
                onSaveEdit={handleSaveEdit}
                showWordCount={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Word Count Setting Dialog */}
      <Dialog open={wordCountDialogOpen} onOpenChange={setWordCountDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>字数设置</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="wordCount">预计生成字数</Label>
              <Input
                id="wordCount"
                type="number"
                value={editingWordCount}
                onChange={(e) => setEditingWordCount(e.target.value)}
                min="1"
                max="10000"
                placeholder="1000"
              />
              <p className="text-xs text-gray-500 mt-1">字数范围：1-10000</p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setWordCountDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveWordCount} className="bg-sky-600 hover:bg-sky-700">
                确定
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidGeneration;

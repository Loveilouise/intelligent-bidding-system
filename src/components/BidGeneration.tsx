import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  catalogType,
  setCatalogType,
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
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [currentGenerateItem, setCurrentGenerateItem] = useState<{ id: string, title: string } | null>(null);

  // Sample data - separate catalogs for business and technical with default 1000 words
  const [businessCatalogItems, setBusinessCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: 'b1', 
      title: '投标函', 
      level: 1,
      expanded: true,
      wordCount: 1000,
      children: [
        { id: 'b1-1', title: '投标函', level: 2, wordCount: 1000 },
        { id: 'b1-2', title: '法定代表人身份证明', level: 2, wordCount: 1000 },
        { id: 'b1-3', title: '授权委托书', level: 2, wordCount: 1000 }
      ]
    },
    { id: 'b2', title: '资质证明文件', level: 1, expanded: true, wordCount: 1000 },
    { id: 'b3', title: '财务状况报告', level: 1, expanded: true, wordCount: 1000 }
  ]);

  const [technicalCatalogItems, setTechnicalCatalogItems] = useState<CatalogItemType[]>([
    { 
      id: 't1', 
      title: '技术方案', 
      level: 1,
      expanded: true,
      wordCount: 1000,
      children: [
        { id: 't1-1', title: '总体技术方案', level: 2, wordCount: 1000 },
        { id: 't1-2', title: '技术路线', level: 2, wordCount: 1000 },
        { id: 't1-3', title: '关键技术', level: 2, wordCount: 1000 }
      ]
    },
    { id: 't2', title: '项目组织架构', level: 1, expanded: true, wordCount: 1000 },
    { id: 't3', title: '进度计划', level: 1, expanded: true, wordCount: 1000 },
    { id: 't4', title: '质量保证措施', level: 1, expanded: true, wordCount: 1000 }
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

  const getAllItemIds = (items: CatalogItemType[]): string[] => {
    const ids: string[] = [];
    items.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        ids.push(...getAllItemIds(item.children));
      }
    });
    return ids;
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

  const handleBusinessSelectAll = (checked: boolean) => {
    setBusinessSelectAll(checked);
    if (checked) {
      const allIds = getAllItemIds(businessCatalogItems);
      setBusinessSelectedItems(new Set(allIds));
    } else {
      setBusinessSelectedItems(new Set());
    }
  };

  const handleTechnicalSelectAll = (checked: boolean) => {
    setTechnicalSelectAll(checked);
    if (checked) {
      const allIds = getAllItemIds(technicalCatalogItems);
      setTechnicalSelectedItems(new Set(allIds));
    } else {
      setTechnicalSelectedItems(new Set());
    }
  };

  const handleBusinessItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(businessSelectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setBusinessSelectedItems(newSelected);
    
    const allIds = getAllItemIds(businessCatalogItems);
    setBusinessSelectAll(newSelected.size === allIds.length);
  };

  const handleTechnicalItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(technicalSelectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setTechnicalSelectedItems(newSelected);
    
    const allIds = getAllItemIds(technicalCatalogItems);
    setTechnicalSelectAll(newSelected.size === allIds.length);
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

  const handleGenerate = (itemId: string, title: string) => {
    setCurrentGenerateItem({ id: itemId, title });
    setGenerateDialogOpen(true);
  };

  const handleConfirmGenerate = () => {
    if (currentGenerateItem) {
      // TODO: Implement actual generation logic
      console.log(`Generating content for: ${currentGenerateItem.title}`);
    }
    setGenerateDialogOpen(false);
    setCurrentGenerateItem(null);
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
    <div className="h-[600px]">
      <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')} className="h-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="business">商务标</TabsTrigger>
          <TabsTrigger value="technical">技术标</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="h-[calc(100%-3rem)]">
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setBusinessExpanded(!businessExpanded)}
                >
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
                      onCheckedChange={(checked) => handleBusinessSelectAll(checked === true)}
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

            {businessExpanded && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {businessCatalogItems.map(item => (
                    <CatalogItem
                      key={item.id}
                      item={item}
                      batchMode={businessBatchMode}
                      isSelected={businessSelectedItems.has(item.id)}
                      onToggleSelect={handleBusinessItemSelect}
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="h-[calc(100%-3rem)]">
          <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTechnicalExpanded(!technicalExpanded)}
                >
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
                      onCheckedChange={(checked) => handleTechnicalSelectAll(checked === true)}
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

            {technicalExpanded && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {technicalCatalogItems.map(item => (
                    <CatalogItem
                      key={item.id}
                      item={item}
                      batchMode={technicalBatchMode}
                      isSelected={technicalSelectedItems.has(item.id)}
                      onToggleSelect={handleTechnicalItemSelect}
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
            )}
          </div>
        </TabsContent>
      </Tabs>

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
      
      {/* Generate Confirmation Dialog */}
      <AlertDialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认生成</AlertDialogTitle>
            <AlertDialogDescription>
              整章生成会替换已经生成的内容，确定生成吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate} className="bg-sky-600 hover:bg-sky-700">
              立即生成
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BidGeneration;

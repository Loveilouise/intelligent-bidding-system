import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, FileText, Users, HelpCircle, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CatalogItem from '@/components/CatalogItem';
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
  catalogExpanded,
  setCatalogExpanded,
  rightPanelTab,
  setRightPanelTab,
  catalogItems,
  setCatalogItems,
  onRegenerateCatalog
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [wordCountDialogOpen, setWordCountDialogOpen] = useState(false);
  const [currentEditingWordCount, setCurrentEditingWordCount] = useState<{id: string, count: number} | null>(null);
  const [tempWordCount, setTempWordCount] = useState('');

  const handleToggleExpansion = (itemId: string) => {
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
    setCatalogItems(updateItems(catalogItems));
  };

  const handleAddSameLevel = (parentId: string | null, afterId: string) => {
    const newId = Date.now().toString();
    const newItem: CatalogItemType = {
      id: newId,
      title: '新章节',
      level: getItemLevel(afterId) || 1,
      wordCount: 1000
    };

    const addItem = (items: CatalogItemType[]): CatalogItemType[] => {
      if (!parentId) {
        const index = items.findIndex(item => item.id === afterId);
        return [...items.slice(0, index + 1), newItem, ...items.slice(index + 1)];
      }
      
      return items.map(item => {
        if (item.id === parentId && item.children) {
          const index = item.children.findIndex(child => child.id === afterId);
          const newChildren = [...item.children.slice(0, index + 1), newItem, ...item.children.slice(index + 1)];
          return { ...item, children: newChildren };
        }
        if (item.children) {
          return { ...item, children: addItem(item.children) };
        }
        return item;
      });
    };

    setCatalogItems(addItem(catalogItems));
  };

  const handleAddSubLevel = (parentId: string) => {
    const newId = Date.now().toString();
    const parentLevel = getItemLevel(parentId) || 1;
    const newItem: CatalogItemType = {
      id: newId,
      title: '新子章节',
      level: parentLevel + 1,
      wordCount: 1000
    };

    const addSubItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            expanded: true,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return { ...item, children: addSubItem(item.children) };
        }
        return item;
      });
    };

    setCatalogItems(addSubItem(catalogItems));
  };

  const handleDelete = (itemId: string) => {
    const removeItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.filter(item => {
        if (item.id === itemId) return false;
        if (item.children) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };
    setCatalogItems(removeItem(catalogItems));
  };

  const handleDoubleClick = (itemId: string, title: string) => {
    setEditingItem(itemId);
    setEditingText(title);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editingText.trim()) return;
    
    const updateItem = (items: CatalogItemType[]): CatalogItemType[] => {
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
    
    setCatalogItems(updateItem(catalogItems));
    setEditingItem(null);
    setEditingText('');
  };

  const handleWordCountSetting = (itemId: string, currentCount: number) => {
    setCurrentEditingWordCount({ id: itemId, count: currentCount });
    setTempWordCount(currentCount.toString());
    setWordCountDialogOpen(true);
  };

  const handleSaveWordCount = () => {
    if (!currentEditingWordCount) return;
    
    const newCount = parseInt(tempWordCount) || 1000;
    const updateItem = (items: CatalogItemType[]): CatalogItemType[] => {
      return items.map(item => {
        if (item.id === currentEditingWordCount.id) {
          return { ...item, wordCount: newCount };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };
    
    setCatalogItems(updateItem(catalogItems));
    setWordCountDialogOpen(false);
    setCurrentEditingWordCount(null);
    setTempWordCount('');
  };

  const getItemLevel = (itemId: string): number | null => {
    const findItem = (items: CatalogItemType[]): CatalogItemType | null => {
      for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const item = findItem(catalogItems);
    return item?.level || null;
  };

  const calculateTotalWords = () => {
    const countWords = (items: CatalogItemType[]): number => {
      return items.reduce((total, item) => {
        const itemWords = item.wordCount || 1000;
        const childWords = item.children ? countWords(item.children) : 0;
        return total + itemWords + childWords;
      }, 0);
    };
    return countWords(catalogItems);
  };

  if (generationStatus === 'generating') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成目录</h2>
          <p className="text-gray-600 mb-4">AI正在根据您的需求和上传的文件生成标书目录...</p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>预计需要1-2分钟</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex">
      {/* 左侧目录区域 - 固定宽度 */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">生成的目录</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateCatalog}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              重新生成
            </Button>
          </div>
          
          <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="business" className="text-sm">商务标</TabsTrigger>
              <TabsTrigger value="technical" className="text-sm">技术标</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">预计总字数：</span>
              <span className="font-medium text-gray-900">{calculateTotalWords().toLocaleString()}字</span>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {catalogItems.map(item => (
              <CatalogItem
                key={item.id}
                item={item}
                parentId={null}
                onToggleExpansion={handleToggleExpansion}
                onAddSameLevel={handleAddSameLevel}
                onAddSubLevel={handleAddSubLevel}
                onDelete={handleDelete}
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
        </ScrollArea>
      </div>

      {/* 右侧信息面板 - 占据剩余空间 */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as 'requirements' | 'information')}>
            <TabsList>
              <TabsTrigger value="requirements" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                招标要求
              </TabsTrigger>
              <TabsTrigger value="information" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                企业信息
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-6">
              <TabsContent value="requirements" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      关键要求提醒
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 项目经验要求：近3年内有类似项目经验</li>
                      <li>• 技术要求：必须支持分布式架构</li>
                      <li>• 资质要求：具备软件企业认定证书</li>
                      <li>• 投标保证金：50万元人民币</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">技术规格要求</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 系统架构：微服务架构，支持容器化部署</p>
                      <p>• 数据库：支持MySQL 8.0及以上版本</p>
                      <p>• 并发处理：支持10000+用户同时在线</p>
                      <p>• 响应时间：页面响应时间不超过2秒</p>
                      <p>• 安全要求：符合等保三级要求</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="information" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">企业基本信息</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">公司名称：</span>
                        <span className="text-gray-900">北京创新科技有限公司</span>
                      </div>
                      <div>
                        <span className="text-gray-600">成立时间：</span>
                        <span className="text-gray-900">2015年3月</span>
                      </div>
                      <div>
                        <span className="text-gray-600">注册资本：</span>
                        <span className="text-gray-900">5000万元</span>
                      </div>
                      <div>
                        <span className="text-gray-600">员工数量：</span>
                        <span className="text-gray-900">280人</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">核心资质证书</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• 高新技术企业证书</p>
                      <p>• ISO 9001质量管理体系认证</p>
                      <p>• ISO 27001信息安全管理体系认证</p>
                      <p>• CMMI 5级认证</p>
                      <p>• 软件企业认定证书</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">近期项目经验</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-sky-500 pl-3">
                        <h5 className="font-medium text-gray-900">智慧城市综合管理平台</h5>
                        <p className="text-sm text-gray-600">项目金额：2800万元 | 完成时间：2023年10月</p>
                      </div>
                      <div className="border-l-4 border-sky-500 pl-3">
                        <h5 className="font-medium text-gray-900">企业数字化转型系统</h5>
                        <p className="text-sm text-gray-600">项目金额：1500万元 | 完成时间：2023年8月</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* 字数设置弹窗 */}
      <Dialog open={wordCountDialogOpen} onOpenChange={setWordCountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置章节字数</DialogTitle>
            <DialogDescription>
              请设置该章节的目标字数，系统将根据此字数生成相应长度的内容。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wordCount" className="text-right">
                字数
              </Label>
              <Input
                id="wordCount"
                value={tempWordCount}
                onChange={(e) => setTempWordCount(e.target.value)}
                className="col-span-3"
                placeholder="请输入字数"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setWordCountDialogOpen(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleSaveWordCount}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidGeneration;

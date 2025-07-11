
import React, { useState } from 'react';
import { Search, File, Image, Table, Folder, FolderOpen, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MaterialItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'table';
  content?: string;
}

interface MaterialFolder {
  id: string;
  name: string;
  items: MaterialItem[];
  children?: MaterialFolder[];
}

interface MaterialLibraryProps {
  onInsertMaterial?: (content: string) => void;
}

const MaterialLibrary: React.FC<MaterialLibraryProps> = ({ onInsertMaterial }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'document' | 'image' | 'table'>('all');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  // Mock data
  const [folders] = useState<MaterialFolder[]>([
    {
      id: 'root',
      name: '根目录',
      items: [
        { id: '1', name: '公司简介模板.docx', type: 'document', content: '我们公司成立于...' },
        { id: '2', name: '组织架构图.png', type: 'image', content: '[组织架构图]' },
        { id: '3', name: '财务报表.xlsx', type: 'table', content: '[财务数据表格]' }
      ],
      children: [
        {
          id: 'tech',
          name: '技术方案',
          items: [
            { id: '4', name: '技术架构图.png', type: 'image', content: '[技术架构图]' },
            { id: '5', name: '实施计划表.xlsx', type: 'table', content: '[实施计划表格]' }
          ]
        },
        {
          id: 'business',
          name: '商务文档',
          items: [
            { id: '6', name: '合作案例.docx', type: 'document', content: '过往合作案例包括...' },
            { id: '7', name: '报价模板.xlsx', type: 'table', content: '[报价表格模板]' }
          ]
        }
      ]
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <File className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'table': return <Table className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-500';
      case 'image': return 'text-green-500';
      case 'table': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getCurrentFolderData = (): MaterialFolder | undefined => {
    const findFolder = (folders: MaterialFolder[], id: string): MaterialFolder | undefined => {
      for (const folder of folders) {
        if (folder.id === id) return folder;
        if (folder.children) {
          const found = findFolder(folder.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findFolder(folders, currentFolder);
  };

  const getFilteredItems = (items: MaterialItem[]) => {
    return items.filter(item => {
      const matchesSearch = searchKeyword === '' || 
        item.name.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: MaterialFolder, level: number = 0) => (
    <div key={folder.id}>
      <div 
        className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer rounded text-sm`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (folder.children) {
            toggleFolder(folder.id);
          } else {
            setCurrentFolder(folder.id);
          }
        }}
      >
        {folder.children && (
          expandedFolders.has(folder.id) ? 
          <FolderOpen className="w-4 h-4 mr-2 text-blue-500" /> : 
          <Folder className="w-4 h-4 mr-2 text-blue-500" />
        )}
        {!folder.children && <Folder className="w-4 h-4 mr-2 text-blue-500" />}
        <span className="flex-1">{folder.name}</span>
      </div>
      {folder.children && expandedFolders.has(folder.id) && (
        <div>
          {folder.children.map(child => renderFolder(child, level + 1))}
        </div>
      )}
    </div>
  );

  const currentFolderData = getCurrentFolderData();
  const filteredItems = currentFolderData ? getFilteredItems(currentFolderData.items) : [];

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Folder className="w-4 h-4 mr-2" />
          素材库
        </h4>
        
        {/* 搜索框 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索素材..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10 h-8 text-sm"
          />
        </div>

        {/* 类型筛选 */}
        <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
            <TabsTrigger value="document" className="text-xs">文档</TabsTrigger>
            <TabsTrigger value="image" className="text-xs">图片</TabsTrigger>
            <TabsTrigger value="table" className="text-xs">表格</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        {currentFolder === 'root' ? (
          <div className="p-2">
            {folders[0]?.children?.map(folder => renderFolder(folder))}
          </div>
        ) : (
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolder('root')}
              className="mb-2 text-sm"
            >
              ← 返回上级
            </Button>
            <div className="space-y-1">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onInsertMaterial && onInsertMaterial(item.content || item.name)}
                >
                  <div className="flex items-center">
                    <span className={getTypeColor(item.type)}>
                      {getTypeIcon(item.type)}
                    </span>
                    <span className="ml-2 text-sm flex-1">{item.name}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MaterialLibrary;

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Trash2, Download, FileText, Image, Table as TableIcon, Edit, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface KnowledgeFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'doc' | 'image' | 'table' | 'other';
  size: string;
  uploadTime: string;
  status: 'processing' | 'completed' | 'failed';
  folderId: string;
}

interface MaterialFolder {
  id: string;
  name: string;
  isEditing?: boolean;
}

const PersonalKnowledge: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [folderSearchTerm, setFolderSearchTerm] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('1');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const [folders, setFolders] = useState<MaterialFolder[]>([
    { id: '1', name: '新建文件夹' },
    { id: '2', name: '项目文档' },
    { id: '3', name: '设计素材' },
    { id: '4', name: '表格数据' }
  ]);

  const [files] = useState<KnowledgeFile[]>([
    {
      id: '1',
      name: '项目需求文档.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadTime: '2024-03-15 14:30',
      status: 'completed',
      folderId: '1'
    },
    {
      id: '2',
      name: '技术方案.docx',
      type: 'docx',
      size: '1.8 MB',
      uploadTime: '2024-03-14 16:20',
      status: 'completed',
      folderId: '2'
    },
    {
      id: '3',
      name: '数据统计表.xlsx',
      type: 'table',
      size: '856 KB',
      uploadTime: '2024-03-13 10:15',
      status: 'processing',
      folderId: '4'
    },
    {
      id: '4',
      name: '流程图.png',
      type: 'image',
      size: '324 KB',
      uploadTime: '2024-03-12 09:45',
      status: 'completed',
      folderId: '3'
    }
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'docx':
      case 'doc':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'table':
        return <TableIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">已完成</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800">处理中</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">失败</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const filteredFiles = files.filter(file => file.folderId === selectedFolderId).filter(file => {
    if (activeTab === 'all') return true;
    if (activeTab === 'documents') return ['pdf', 'docx', 'doc'].includes(file.type);
    if (activeTab === 'images') return file.type === 'image';
    if (activeTab === 'tables') return file.type === 'table';
    if (activeTab === 'others') return !['pdf', 'docx', 'doc', 'image', 'table'].includes(file.type);
    return true;
  }).filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(folderSearchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('上传文件:', Array.from(files).map(f => f.name));
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
    setDeleteFolderDialogOpen(true);
  };

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      console.log('删除文件:', fileToDelete);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const confirmDeleteFolder = () => {
    if (folderToDelete) {
      setFolders(folders.filter(f => f.id !== folderToDelete));
      setDeleteFolderDialogOpen(false);
      setFolderToDelete(null);
      if (selectedFolderId === folderToDelete && folders.length > 1) {
        setSelectedFolderId(folders.find(f => f.id !== folderToDelete)?.id || '1');
      }
    }
  };

  const handleAddFolder = () => {
    setShowNewFolderInput(true);
    setNewFolderName('');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: MaterialFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim()
      };
      setFolders([...folders, newFolder]);
      setShowNewFolderInput(false);
      setNewFolderName('');
    }
  };

  const handleCancelNewFolder = () => {
    setShowNewFolderInput(false);
    setNewFolderName('');
  };

  const handleStartEdit = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setEditingFolderName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingFolderId && editingFolderName.trim()) {
      setFolders(folders.map(f => 
        f.id === editingFolderId 
          ? { ...f, name: editingFolderName.trim() }
          : f
      ));
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* 头部标题栏 */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">素材库</h1>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
              <Button 
                size="sm"
                className="bg-sky-600 hover:bg-sky-700"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Plus className="w-4 h-4 mr-2" />
                上传素材
              </Button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex flex-1 pt-16">
          {/* 左侧素材库列表 */}
          <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">搜索素材库</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddFolder}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="搜索..."
                  value={folderSearchTerm}
                  onChange={(e) => setFolderSearchTerm(e.target.value)}
                  className="pl-10 h-8"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {filteredFolders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedFolderId === folder.id 
                        ? 'bg-sky-50 border border-sky-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    {editingFolderId === folder.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className="h-6 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          onBlur={handleSaveEdit}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 flex-1">
                          <FolderPlus className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-medium truncate">{folder.name}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(folder.id, folder.name);
                            }}>
                              <Edit className="w-3 h-3 mr-2" />
                              重命名
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFolder(folder.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                ))}
                {showNewFolderInput && (
                  <div className="p-2 border border-sky-200 rounded-lg bg-sky-50">
                    <Input
                      placeholder="输入文件夹名称"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="h-6 text-xs mb-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateFolder();
                        if (e.key === 'Escape') handleCancelNewFolder();
                      }}
                      autoFocus
                    />
                    <div className="flex space-x-1">
                      <Button size="sm" onClick={handleCreateFolder} className="h-6 text-xs">
                        确定
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelNewFolder} className="h-6 text-xs">
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧文件管理 */}
          <div className="flex-1 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium">
                  {selectedFolder?.name || '素材管理'}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="搜索文件..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    筛选
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="documents">文档</TabsTrigger>
                  <TabsTrigger value="images">图片</TabsTrigger>
                  <TabsTrigger value="tables">表格</TabsTrigger>
                  <TabsTrigger value="others">其他</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>文件大小</TableHead>
                    <TableHead>上传时间</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        暂无文件
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <span className="font-medium">{file.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>{file.uploadTime}</TableCell>
                        <TableCell>{getStatusBadge(file.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                下载
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* 删除文件确认对话框 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除这个文件吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteFile} className="bg-red-600 hover:bg-red-700">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* 删除文件夹确认对话框 */}
        <AlertDialog open={deleteFolderDialogOpen} onOpenChange={setDeleteFolderDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除文件夹</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除这个文件夹吗？文件夹中的所有文件也会被删除，此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteFolder} className="bg-red-600 hover:bg-red-700">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PersonalKnowledge;

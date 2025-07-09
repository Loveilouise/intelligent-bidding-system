import React, { useState } from 'react';
import { Plus, Search, MoreHorizontal, Trash2, Eye, FileText, Image, Table as TableIcon, Edit, FolderPlus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KnowledgeFile {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'doc' | 'image' | 'table' | 'other';
  size: string;
  uploadTime: string;
  status: 'parsing' | 'success' | 'failed';
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
  const [uploadSheetOpen, setUploadSheetOpen] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [materialFormat, setMaterialFormat] = useState<string>('document');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      status: 'success',
      folderId: '1'
    },
    {
      id: '2',
      name: '技术方案.docx',
      type: 'docx',
      size: '1.8 MB',
      uploadTime: '2024-03-14 16:20',
      status: 'success',
      folderId: '2'
    },
    {
      id: '3',
      name: '数据统计表.xlsx',
      type: 'table',
      size: '856 KB',
      uploadTime: '2024-03-13 10:15',
      status: 'parsing',
      folderId: '4'
    },
    {
      id: '4',
      name: '流程图.png',
      type: 'image',
      size: '324 KB',
      uploadTime: '2024-03-12 09:45',
      status: 'failed',
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
      case 'success':
        return <Badge className="bg-green-100 text-green-800">解析成功</Badge>;
      case 'parsing':
        return <Badge className="bg-yellow-100 text-yellow-800">解析中</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">解析失败</Badge>;
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
      const fileArray = Array.from(files);
      setUploadedFiles(fileArray);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleViewFile = (fileId: string) => {
    console.log('查看文件:', fileId);
    // 这里可以实现文件查看逻辑
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

  const handleSaveUpload = () => {
    console.log('保存上传:', {
      materialName,
      materialFormat,
      uploadedFiles
    });
    setUploadSheetOpen(false);
    // 重置表单
    setMaterialName('');
    setMaterialFormat('document');
    setUploadedFiles([]);
  };

  const handleCancelUpload = () => {
    setUploadSheetOpen(false);
    // 重置表单
    setMaterialName('');
    setMaterialFormat('document');
    setUploadedFiles([]);
  };

  const getFileFormatText = (format: string) => {
    switch (format) {
      case 'document':
        return '支持PDF、DOC、DOCX格式，大小不超过50MB';
      case 'image':
        return '支持PNG、JPG、JPEG格式，大小不超过10MB';
      case 'table':
        return '支持XLS、XLSX格式，大小不超过20MB';
      default:
        return '请选择文件格式';
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
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

        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
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
                <Sheet open={uploadSheetOpen} onOpenChange={setUploadSheetOpen}>
                  <SheetTrigger asChild>
                    <Button className="bg-sky-600 hover:bg-sky-700">
                      <Plus className="w-4 h-4 mr-2" />
                      上传素材
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>上传素材</SheetTitle>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">素材名称</Label>
                        <Input
                          placeholder="请输入素材名称"
                          value={materialName}
                          onChange={(e) => setMaterialName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">素材格式</Label>
                        <RadioGroup value={materialFormat} onValueChange={setMaterialFormat}>
                          <div className="grid grid-cols-3 gap-3">
                            <div 
                              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sky-300 ${
                                materialFormat === 'document' 
                                  ? 'border-sky-500 bg-sky-50' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setMaterialFormat('document')}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <FileText className="w-8 h-8 text-red-500" />
                                <h3 className="font-medium text-gray-900 text-sm">文档</h3>
                                <p className="text-xs text-gray-500 text-center">PDF、DOC、DOCX</p>
                                <RadioGroupItem 
                                  value="document" 
                                  className="text-sky-600"
                                />
                              </div>
                            </div>

                            <div 
                              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sky-300 ${
                                materialFormat === 'image' 
                                  ? 'border-sky-500 bg-sky-50' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setMaterialFormat('image')}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <Image className="w-8 h-8 text-green-500" />
                                <h3 className="font-medium text-gray-900 text-sm">图片</h3>
                                <p className="text-xs text-gray-500 text-center">PNG、JPG、JPEG</p>
                                <RadioGroupItem 
                                  value="image" 
                                  className="text-sky-600"
                                />
                              </div>
                            </div>

                            <div 
                              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-sky-300 ${
                                materialFormat === 'table' 
                                  ? 'border-sky-500 bg-sky-50' 
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setMaterialFormat('table')}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <TableIcon className="w-8 h-8 text-blue-500" />
                                <h3 className="font-medium text-gray-900 text-sm">表格</h3>
                                <p className="text-xs text-gray-500 text-center">XLS、XLSX</p>
                                <RadioGroupItem 
                                  value="table" 
                                  className="text-sky-600"
                                />
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">上传文件</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            id="material-upload"
                            className="hidden"
                            accept={
                              materialFormat === 'document' ? '.pdf,.doc,.docx' :
                              materialFormat === 'image' ? '.png,.jpg,.jpeg' :
                              materialFormat === 'table' ? '.xls,.xlsx' : '*'
                            }
                            onChange={handleFileUpload}
                          />
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">点击或拖拽上传文件</p>
                          <p className="text-xs text-gray-500">
                            {getFileFormatText(materialFormat)}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={() => document.getElementById('material-upload')?.click()}
                          >
                            选择文件
                          </Button>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">已选择文件</Label>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm truncate">{file.name}</span>
                                  <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)}MB</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 flex space-x-2">
                      <Button variant="outline" onClick={handleCancelUpload}>
                        取消
                      </Button>
                      <Button 
                        onClick={handleSaveUpload}
                        disabled={!materialName || !materialFormat || uploadedFiles.length === 0}
                        className="bg-sky-600 hover:bg-sky-700"
                      >
                        保存
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
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
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewFile(file.id)}
                            className="text-sky-600 hover:text-sky-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            查看
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

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
  );
};

export default PersonalKnowledge;

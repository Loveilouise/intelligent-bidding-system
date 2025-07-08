
import React, { useState } from 'react';
import { Plus, Upload, Search, Filter, MoreHorizontal, Trash2, Download, FileText, Image, Table as TableIcon } from 'lucide-react';
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
  type: 'pdf' | 'docx' | 'doc' | 'image' | 'table';
  size: string;
  uploadTime: string;
  status: 'processing' | 'completed' | 'failed';
}

interface PersonalKB {
  id: string;
  name: string;
  description: string;
  documentsCount: number;
  createdAt: string;
}

const PersonalKnowledge: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const [personalKBs] = useState<PersonalKB[]>([
    {
      id: '1',
      name: '项目文档库',
      description: '存储项目相关文档',
      documentsCount: 45,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: '学习资料库',
      description: '个人学习资料整理',
      documentsCount: 32,
      createdAt: '2024-02-20'
    }
  ]);

  const [files] = useState<KnowledgeFile[]>([
    {
      id: '1',
      name: '项目需求文档.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadTime: '2024-03-15 14:30',
      status: 'completed'
    },
    {
      id: '2',
      name: '技术方案.docx',
      type: 'docx',
      size: '1.8 MB',
      uploadTime: '2024-03-14 16:20',
      status: 'completed'
    },
    {
      id: '3',
      name: '数据统计表.xlsx',
      type: 'table',
      size: '856 KB',
      uploadTime: '2024-03-13 10:15',
      status: 'processing'
    },
    {
      id: '4',
      name: '流程图.png',
      type: 'image',
      size: '324 KB',
      uploadTime: '2024-03-12 09:45',
      status: 'completed'
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

  const filteredFiles = files.filter(file => {
    if (activeTab === 'all') return true;
    if (activeTab === 'documents') return ['pdf', 'docx', 'doc'].includes(file.type);
    if (activeTab === 'images') return file.type === 'image';
    if (activeTab === 'tables') return file.type === 'table';
    return true;
  }).filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const confirmDelete = () => {
    if (fileToDelete) {
      console.log('删除文件:', fileToDelete);
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">个人知识库</h1>
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                  <Plus className="w-4 h-4 mr-2" />
                  新建知识库
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建个人知识库</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input placeholder="知识库名称" />
                  </div>
                  <div>
                    <Input placeholder="知识库描述" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">取消</Button>
                    <Button className="flex-1 bg-sky-600 hover:bg-sky-700">创建</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
              />
              <Button 
                className="bg-sky-600 hover:bg-sky-700"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                上传文件
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 知识库列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>我的知识库</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {personalKBs.map((kb) => (
                    <div
                      key={kb.id}
                      className="p-3 border rounded-lg hover:bg-sky-50 cursor-pointer border-sky-200 hover:border-sky-400 transition-colors"
                    >
                      <div className="font-medium text-sm">{kb.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{kb.description}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        {kb.documentsCount} 个文档
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 文件管理 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>文件管理</CardTitle>
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
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList>
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="documents">文档</TabsTrigger>
                    <TabsTrigger value="images">图片</TabsTrigger>
                    <TabsTrigger value="tables">表格</TabsTrigger>
                  </TabsList>
                </Tabs>

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
                    {filteredFiles.map((file) => (
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 删除确认对话框 */}
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
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
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

import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, FileText, Calendar, Upload, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BidTemplate {
  id: string;
  name: string;
  category: string;
  createDate: string;
  updateDate: string;
  description: string;
  usageCount: number;
  uploadedFile?: string;
  catalogDisplay?: boolean;
  templateCreateMethod?: string;
  catalogContent?: string;
}

const TemplateManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<BidTemplate[]>([
    {
      id: '1',
      name: '市政道路施工方案模板',
      category: '市政工程',
      createDate: '2024-01-10',
      updateDate: '2024-02-15',
      description: '适用于城市道路、桥梁等市政基础设施建设项目',
      usageCount: 12,
      templateCreateMethod: 'file-analysis',
      catalogContent: '1. 投标函\n1.1 投标函\n1.2 法定代表人身份证明\n2. 商务标书\n2.1 公司资质证明\n2.2 财务状况报告'
    },
    {
      id: '2',
      name: '建筑装修工程方案模板',
      category: '装修工程',
      createDate: '2024-01-20',
      updateDate: '2024-02-10',
      description: '包含室内外装修、水电安装等完整施工方案',
      usageCount: 8,
      templateCreateMethod: 'paste-catalog',
      catalogContent: '1. 技术标书\n1.1 技术方案\n1.2 项目组织架构\n2. 商务标书\n2.1 报价清单\n2.2 资质证明'
    },
    {
      id: '3',
      name: '智能化系统集成方案模板',
      category: '系统集成',
      createDate: '2024-02-01',
      updateDate: '2024-02-20',
      description: '智能监控、消防、安防等系统集成标准方案',
      usageCount: 5,
      templateCreateMethod: 'file-analysis',
      catalogContent: '1. 系统设计方案\n1.1 系统架构\n1.2 设备清单\n2. 实施方案\n2.1 安装计划\n2.2 调试方案'
    }
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<BidTemplate | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [templateCreateMethod, setTemplateCreateMethod] = useState<string>('file-analysis');
  const [editTemplateCreateMethod, setEditTemplateCreateMethod] = useState<string>('file-analysis');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    catalogDisplay: '',
    catalogContent: ''
  });

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', category: '', description: '', catalogDisplay: '', catalogContent: '' });
    setUploadedFile(null);
    setTemplateCreateMethod('file-analysis');
    setAddDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        category: template.category,
        description: template.description,
        catalogDisplay: template.catalogDisplay ? 'true' : 'false',
        catalogContent: template.catalogContent || ''
      });
      setEditTemplateCreateMethod(template.templateCreateMethod || 'file-analysis');
      setEditDialogOpen(true);
    }
  };

  const handleCopy = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      const newTemplate: BidTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} - 副本`,
        createDate: new Date().toISOString().split('T')[0],
        updateDate: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleSaveAdd = () => {
    if (formData.name && formData.category && formData.description && formData.catalogContent) {
      const newTemplate: BidTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description,
        createDate: new Date().toISOString().split('T')[0],
        updateDate: new Date().toISOString().split('T')[0],
        usageCount: 0,
        uploadedFile: uploadedFile?.name,
        catalogDisplay: formData.catalogDisplay === 'true',
        templateCreateMethod: templateCreateMethod,
        catalogContent: formData.catalogContent
      };
      setTemplates([...templates, newTemplate]);
      setAddDialogOpen(false);
      setFormData({ name: '', category: '', description: '', catalogDisplay: '', catalogContent: '' });
      setUploadedFile(null);
      setTemplateCreateMethod('file-analysis');
    }
  };

  const handleSaveEdit = () => {
    if (editingTemplate && formData.name && formData.category && formData.description && formData.catalogContent) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? {
              ...t,
              name: formData.name,
              category: formData.category,
              description: formData.description,
              updateDate: new Date().toISOString().split('T')[0],
              catalogDisplay: formData.catalogDisplay === 'true',
              templateCreateMethod: editTemplateCreateMethod,
              catalogContent: formData.catalogContent
            }
          : t
      ));
      setEditDialogOpen(false);
      setEditingTemplate(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">投标方案模板管理</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="搜索模板名称或分类..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAdd}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增模板
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>模板名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>使用次数</TableHead>
                  <TableHead>模板描述</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-full">
                        {template.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{template.createDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{template.updateDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">{template.usageCount}次</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 max-w-xs truncate">{template.description}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(template.id)}
                          className="text-gray-600 hover:text-sky-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(template.id)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? '没有找到匹配的模板' : '还没有投标方案模板'}
              </p>
              <Button 
                onClick={handleAdd}
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                创建第一个模板
              </Button>
            </div>
          )}
        </div>

        {/* 新增模板对话框 */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增模板</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">模板名称</Label>
                <Input
                  id="template-name"
                  placeholder="请输入模板名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-category">分类</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="市政工程">市政工程</SelectItem>
                    <SelectItem value="装修工程">装修工程</SelectItem>
                    <SelectItem value="系统集成">系统集成</SelectItem>
                    <SelectItem value="建筑工程">建筑工程</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-description">模板描述</Label>
                <Textarea
                  id="template-description"
                  placeholder="请输入模板描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>模板创建方式</Label>
                <RadioGroup value={templateCreateMethod} onValueChange={setTemplateCreateMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file-analysis" id="file-analysis" />
                    <Label htmlFor="file-analysis">基于投标文件解析</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paste-catalog" id="paste-catalog" />
                    <Label htmlFor="paste-catalog">粘贴标书目录</Label>
                  </div>
                </RadioGroup>
              </div>

              {templateCreateMethod === 'file-analysis' && (
                <div className="space-y-2">
                  <Label htmlFor="template-file">上传文件</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="template-file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">点击上传投标文件</p>
                    <p className="text-xs text-gray-500 mb-2">支持PDF、DOC、DOCX格式</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('template-file')?.click()}
                    >
                      选择文件
                    </Button>
                    {uploadedFile && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        已选择：{uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="catalog-display">目录显示</Label>
                <Textarea
                  id="catalog-display"
                  placeholder={templateCreateMethod === 'file-analysis' ? "系统将自动提取文件目录..." : "请粘贴标书目录内容"}
                  value={formData.catalogContent}
                  onChange={(e) => setFormData({ ...formData, catalogContent: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSaveAdd}
                disabled={!formData.name || !formData.category || !formData.description || !formData.catalogContent}
                className="bg-sky-600 hover:bg-sky-700"
              >
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 编辑模板对话框 */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>编辑模板</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">模板名称</Label>
                <Input
                  id="edit-template-name"
                  placeholder="请输入模板名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-template-category">分类</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="市政工程">市政工程</SelectItem>
                    <SelectItem value="装修工程">装修工程</SelectItem>
                    <SelectItem value="系统集成">系统集成</SelectItem>
                    <SelectItem value="建筑工程">建筑工程</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-template-description">模板描述</Label>
                <Textarea
                  id="edit-template-description"
                  placeholder="请输入模板描述"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>模板创建方式</Label>
                <RadioGroup value={editTemplateCreateMethod} onValueChange={setEditTemplateCreateMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file-analysis" id="edit-file-analysis" />
                    <Label htmlFor="edit-file-analysis">基于投标文件解析</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paste-catalog" id="edit-paste-catalog" />
                    <Label htmlFor="edit-paste-catalog">粘贴标书目录</Label>
                  </div>
                </RadioGroup>
              </div>

              {editTemplateCreateMethod === 'file-analysis' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-template-file">上传文件</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="edit-template-file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">点击上传投标文件</p>
                    <p className="text-xs text-gray-500 mb-2">支持PDF、DOC、DOCX格式</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('edit-template-file')?.click()}
                    >
                      选择文件
                    </Button>
                    {uploadedFile && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        已选择：{uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="edit-catalog-display">目录显示</Label>
                <Textarea
                  id="edit-catalog-display"
                  placeholder={editTemplateCreateMethod === 'file-analysis' ? "系统将自动提取文件目录..." : "请粘贴标书目录内容"}
                  value={formData.catalogContent}
                  onChange={(e) => setFormData({ ...formData, catalogContent: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={!formData.name || !formData.category || !formData.description || !formData.catalogContent}
                className="bg-sky-600 hover:bg-sky-700"
              >
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 删除确认对话框 */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除这个模板吗？此操作无法撤销。
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

export default TemplateManagement;

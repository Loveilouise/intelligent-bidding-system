
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BidTemplate {
  id: string;
  name: string;
  category: string;
  createDate: string;
  updateDate: string;
  description: string;
  usageCount: number;
}

const TemplateManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates] = useState<BidTemplate[]>([
    {
      id: '1',
      name: '市政道路施工方案模板',
      category: '市政工程',
      createDate: '2024-01-10',
      updateDate: '2024-02-15',
      description: '适用于城市道路、桥梁等市政基础设施建设项目',
      usageCount: 12
    },
    {
      id: '2',
      name: '建筑装修工程方案模板',
      category: '装修工程',
      createDate: '2024-01-20',
      updateDate: '2024-02-10',
      description: '包含室内外装修、水电安装等完整施工方案',
      usageCount: 8
    },
    {
      id: '3',
      name: '智能化系统集成方案模板',
      category: '系统集成',
      createDate: '2024-02-01',
      updateDate: '2024-02-20',
      description: '智能监控、消防、安防等系统集成标准方案',
      usageCount: 5
    }
  ]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    console.log('新增模板');
  };

  const handleEdit = (id: string) => {
    console.log('编辑模板:', id);
  };

  const handleCopy = (id: string) => {
    console.log('复制模板:', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除模板:', id);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">投标方案模板管理</h1>
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
                className="bg-purple-300 hover:bg-purple-400 text-white"
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
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-purple-300" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-full">
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
                          className="text-gray-600 hover:text-purple-300"
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
                className="bg-purple-300 hover:bg-purple-400 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                创建第一个模板
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;

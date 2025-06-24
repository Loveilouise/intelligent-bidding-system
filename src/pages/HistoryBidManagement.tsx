
import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BidProject {
  id: string;
  name: string;
  type: string;
  createDate: string;
  status: '已完成' | '进行中' | '已提交';
  description: string;
}

const HistoryBidManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects] = useState<BidProject[]>([
    {
      id: '1',
      name: '城市道路改造工程投标',
      type: '施工投标',
      createDate: '2024-01-15',
      status: '已完成',
      description: '主要包括道路拓宽、排水系统改造等内容'
    },
    {
      id: '2',
      name: '办公楼装修项目投标',
      type: '装修投标',
      createDate: '2024-02-10',
      status: '已提交',
      description: '包含室内装修设计、施工等全套方案'
    },
    {
      id: '3',
      name: '智能化系统集成项目',
      type: '技术投标',
      createDate: '2024-02-20',
      status: '进行中',
      description: '智能监控、门禁、消防等系统集成'
    }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id: string) => {
    console.log('查看项目:', id);
  };

  const handleEdit = (id: string) => {
    console.log('编辑项目:', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除项目:', id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'text-green-600 bg-green-50';
      case '已提交':
        return 'text-blue-600 bg-blue-50';
      case '进行中':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">历史生标管理</h1>
          <p className="text-gray-600">管理和维护历史投标项目，支持查看、编辑和删除操作</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="搜索项目名称或类型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>投标类型</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>项目描述</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{project.type}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{project.createDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 max-w-xs truncate">{project.description}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(project.id)}
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project.id)}
                          className="text-gray-600 hover:text-purple-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
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

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无项目</h3>
              <p className="text-gray-500">
                {searchTerm ? '没有找到匹配的项目' : '还没有历史生标项目'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryBidManagement;

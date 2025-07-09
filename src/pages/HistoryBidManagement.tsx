import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Calendar, FileText, ArrowUpDown, ChevronDown, Check, Plus, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BidProject {
  id: string;
  name: string;
  type: string;
  createDate: string;
  status: '已完成' | '进行中' | '已提交';
  description: string;
}

interface HistoryBidManagementProps {
  onCreateBid: () => void;
}

const HistoryBidManagement: React.FC<HistoryBidManagementProps> = ({ onCreateBid }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    },
    {
      id: '4',
      name: '园林绿化工程投标',
      type: '施工投标',
      createDate: '2024-03-01',
      status: '已完成',
      description: '城市公园绿化改造项目'
    },
    {
      id: '5',
      name: '医院设备采购投标',
      type: '采购投标',
      createDate: '2024-03-05',
      status: '进行中',
      description: '医疗设备采购及安装调试'
    }
  ]);

  const bidTypes = ['施工投标', '装修投标', '技术投标', '采购投标'];
  const bidStatuses = ['已完成', '进行中', '已提交'];

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(project.type);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(project.status);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createDate);
      const dateB = new Date(b.createDate);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

  const totalPages = Math.ceil(filteredAndSortedProjects.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProjects = filteredAndSortedProjects.slice(startIndex, startIndex + pageSize);

  const handleSearch = () => {
    setCurrentPage(1);
    console.log('搜索关键字:', searchTerm);
  };

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
    setCurrentPage(1);
  };

  const handleView = (id: string) => {
    console.log('查看项目:', id);
  };

  const handleEdit = (id: string) => {
    console.log('编辑项目:', id);
  };

  const handleDelete = (id: string) => {
    console.log('删除项目:', id);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 确保显示5个页码（如果可能）
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center space-x-1">
        {/* 上一页 */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 页码 */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* 省略号和总页数 */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="w-8 h-8 flex items-center justify-center text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 下一页 */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 前往 */}
        <span className="ml-4 text-sm text-gray-500">前往</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value=""
          placeholder="1"
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              handlePageChange(page);
            }
          }}
          className="w-12 h-8 px-2 text-sm border border-gray-300 rounded text-center"
        />
        <span className="text-sm text-gray-500">页</span>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div></div>
              <Button 
                onClick={onCreateBid}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                创建标书
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="搜索项目名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                搜索
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[120px] justify-between">
                    投标类型
                    {selectedTypes.length > 0 && (
                      <span className="ml-2 bg-sky-100 text-sky-600 text-xs px-2 py-1 rounded-full">
                        {selectedTypes.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-white p-2">
                  <div className="space-y-1">
                    {bidTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded hover:bg-sky-50 hover:text-sky-600"
                        onClick={() => handleTypeChange(type)}
                      >
                        <span>{type}</span>
                        {selectedTypes.includes(type) && (
                          <Check className="w-4 h-4 text-sky-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[100px] justify-between">
                    状态
                    {selectedStatuses.length > 0 && (
                      <span className="ml-2 bg-sky-100 text-sky-600 text-xs px-2 py-1 rounded-full">
                        {selectedStatuses.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 bg-white p-2">
                  <div className="space-y-1">
                    {bidStatuses.map((status) => (
                      <div
                        key={status}
                        className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded hover:bg-sky-50 hover:text-sky-600"
                        onClick={() => handleStatusChange(status)}
                      >
                        <span>{status}</span>
                        {selectedStatuses.includes(status) && (
                          <Check className="w-4 h-4 text-sky-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>投标类型</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={toggleSortOrder}
                      className="flex items-center space-x-1 p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
                    >
                      <span>创建时间</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>项目描述</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((project) => (
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
                          className="text-gray-600 hover:text-sky-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除项目 "{project.name}" 吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">每页显示</span>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">条记录</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                显示 {startIndex + 1}-{Math.min(startIndex + pageSize, filteredAndSortedProjects.length)} 条，共 {filteredAndSortedProjects.length} 条
              </span>
              
              {renderPagination()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryBidManagement;

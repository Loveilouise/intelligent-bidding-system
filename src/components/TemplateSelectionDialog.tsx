
import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  catalogContent: string;
}

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: Template) => void;
}

const TemplateSelectionDialog: React.FC<TemplateSelectionDialogProps> = ({
  open,
  onOpenChange,
  onTemplateSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const itemsPerPage = 10;

  // Mock template data - in real app, this would come from the template management
  const allTemplates: Template[] = [
    {
      id: 'template1',
      name: '市政道路施工方案模板',
      category: '市政工程',
      description: '适用于城市道路、桥梁等市政基础设施建设项目',
      catalogContent: '1. 投标函\n   1.1 投标函\n   1.2 法定代表人身份证明\n   1.3 授权委托书\n2. 商务标书\n   2.1 公司资质证明\n   2.2 财务状况报告\n   2.3 项目业绩证明\n3. 技术标书\n   3.1 技术方案\n   3.2 项目组织架构\n   3.3 进度计划\n   3.4 质量保证措施'
    },
    {
      id: 'template2',
      name: '建筑装修工程方案模板',
      category: '装修工程',
      description: '包含室内外装修、水电安装等完整施工方案',
      catalogContent: '1. 技术标书\n   1.1 技术方案\n   1.2 项目组织架构\n   1.3 施工工艺\n2. 商务标书\n   2.1 报价清单\n   2.2 资质证明\n   2.3 业绩证明\n3. 投标函\n   3.1 投标函\n   3.2 法人授权书'
    },
    {
      id: 'template3',
      name: '智能化系统集成方案模板',
      category: '系统集成',
      description: '智能监控、消防、安防等系统集成标准方案',
      catalogContent: '1. 系统设计方案\n   1.1 系统架构\n   1.2 设备清单\n   1.3 技术规格\n2. 实施方案\n   2.1 安装计划\n   2.2 调试方案\n   2.3 验收标准\n3. 商务标书\n   3.1 报价明细\n   3.2 公司资质'
    },
    {
      id: 'template4',
      name: '通用投标模板',
      category: '通用',
      description: '适用于多种类型项目的通用投标模板',
      catalogContent: '1. 投标函及投标函附录\n2. 法定代表人身份证明\n3. 授权委托书\n4. 投标保证金\n5. 已标价工程量清单\n6. 技术标书\n7. 商务标书\n8. 资格审查资料'
    },
    {
      id: 'template5',
      name: '水利工程施工方案模板',
      category: '水利工程',
      description: '水库、河道治理等水利工程专用模板',
      catalogContent: '1. 投标文件\n   1.1 投标函\n   1.2 投标保证金\n2. 技术标书\n   2.1 施工方案\n   2.2 质量控制\n3. 商务标书\n   3.1 工程报价\n   3.2 资质材料'
    },
    // Add more templates to test pagination
    {
      id: 'template6',
      name: '机电安装工程模板',
      category: '机电工程',
      description: '机电设备安装及维护工程模板',
      catalogContent: '1. 安装方案\n2. 设备清单\n3. 技术规范'
    },
    {
      id: 'template7',
      name: '园林绿化工程模板',
      category: '园林工程',
      description: '园林景观设计与施工模板',
      catalogContent: '1. 设计方案\n2. 植物配置\n3. 养护计划'
    },
    {
      id: 'template8',
      name: '环保治理工程模板',
      category: '环保工程',
      description: '环境治理与污染控制工程模板',
      catalogContent: '1. 治理方案\n2. 环保措施\n3. 监测计划'
    },
    {
      id: 'template9',
      name: '电力工程施工模板',
      category: '电力工程',
      description: '电力设施建设与改造工程模板',
      catalogContent: '1. 施工方案\n2. 安全措施\n3. 调试方案'
    },
    {
      id: 'template10',
      name: '通信工程建设模板',
      category: '通信工程',
      description: '通信基础设施建设工程模板',
      catalogContent: '1. 网络设计\n2. 设备安装\n3. 测试验收'
    },
    {
      id: 'template11',
      name: '软件开发项目模板',
      category: '软件工程',
      description: '软件系统开发与实施模板',
      catalogContent: '1. 需求分析\n2. 系统设计\n3. 开发实施'
    },
    {
      id: 'template12',
      name: '咨询服务项目模板',
      category: '咨询服务',
      description: '管理咨询与技术服务模板',
      catalogContent: '1. 服务方案\n2. 实施计划\n3. 成果交付'
    }
  ];

  const categories = ['市政工程', '装修工程', '系统集成', '通用', '水利工程', '机电工程', '园林工程', '环保工程', '电力工程', '通信工程', '软件工程', '咨询服务'];

  // Filter templates based on search term and category
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSelect = (template: Template) => {
    onTemplateSelect(template);
    onOpenChange(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? "bg-sky-600 hover:bg-sky-700" : ""}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[70vh]">
          <DialogHeader>
            <DialogTitle>选择投标模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索模板名称或描述..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-40">
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="分类筛选" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Template List */}
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {paginatedTemplates.length > 0 ? (
                <div className="divide-y">
                  {paginatedTemplates.map((template) => (
                    <div key={template.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
                            <h3 className="font-medium text-gray-900 text-sm truncate">{template.name}</h3>
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium text-sky-700 bg-sky-100 rounded-full flex-shrink-0">
                              {template.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{template.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(template)}
                            className="text-xs px-2 py-1"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            预览
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSelect(template)}
                            className="bg-sky-600 hover:bg-sky-700 text-xs px-2 py-1"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            选择
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">暂无模板</h3>
                  <p className="text-xs text-gray-500">没有找到匹配的模板</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>模板预览 - {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full">
                  {previewTemplate.category}
                </span>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">模板描述</Label>
                <p className="text-sm text-gray-600 mt-1">{previewTemplate.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">目录结构</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-[200px] overflow-y-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {previewTemplate.catalogContent}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)} size="sm">
                  关闭
                </Button>
                <Button 
                  onClick={() => {
                    handleSelect(previewTemplate);
                    setPreviewDialogOpen(false);
                  }}
                  className="bg-sky-600 hover:bg-sky-700"
                  size="sm"
                >
                  使用此模板
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateSelectionDialog;

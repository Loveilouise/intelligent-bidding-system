
import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
    }
  ];

  const categories = ['市政工程', '装修工程', '系统集成', '通用', '水利工程', '建筑工程'];

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>选择投标模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-4">
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
              <div className="w-48">
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="按分类筛选" />
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
            <div className="border rounded-lg">
              {paginatedTemplates.length > 0 ? (
                <div className="divide-y">
                  {paginatedTemplates.map((template) => (
                    <div key={template.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <FileText className="w-5 h-5 text-sky-600" />
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <span className="inline-flex px-2 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full">
                              {template.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            预览
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSelect(template)}
                            className="bg-sky-600 hover:bg-sky-700"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            选择
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模板</h3>
                  <p className="text-gray-500">没有找到匹配的模板</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>模板预览 - {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
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
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {previewTemplate.catalogContent}
                  </pre>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                  关闭
                </Button>
                <Button 
                  onClick={() => {
                    handleSelect(previewTemplate);
                    setPreviewDialogOpen(false);
                  }}
                  className="bg-sky-600 hover:bg-sky-700"
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

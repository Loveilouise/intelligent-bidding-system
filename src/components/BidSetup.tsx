import React, { useState } from 'react';
import { Upload, FileText, Settings, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectInfo, UploadedFile } from '@/types/bid';

interface BidSetupProps {
  projectInfo: ProjectInfo;
  setProjectInfo: (info: ProjectInfo) => void;
  settingsMode: string;
  setSettingsMode: (mode: string) => void;
  uploadedFiles: UploadedFile[];
  customCatalog: string;
  setCustomCatalog: (catalog: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedKnowledgeBase: string;
  setSelectedKnowledgeBase: (kb: string) => void;
}

const BidSetup: React.FC<BidSetupProps> = ({
  projectInfo,
  setProjectInfo,
  settingsMode,
  setSettingsMode,
  uploadedFiles,
  customCatalog,
  setCustomCatalog,
  selectedTemplate,
  setSelectedTemplate,
  selectedKnowledgeBase,
  setSelectedKnowledgeBase
}) => {
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const businessTypes = [
    { value: 'construction', label: '建筑工程' },
    { value: 'equipment', label: '设备采购' },
    { value: 'service', label: '服务类' },
    { value: 'design', label: '设计类' },
    { value: 'consulting', label: '咨询类' }
  ];

  const knowledgeBases = [
    { value: 'kb1', label: '建筑工程知识库' },
    { value: 'kb2', label: '设备采购知识库' },
    { value: 'kb3', label: '服务类知识库' },
    { value: 'kb4', label: '通用知识库' }
  ];

  // Mock template data - in real app, this would come from the template management
  const templates = [
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
    }
  ];

  const catalogReference = `参考格式：
1. 投标函
   1.1 投标函
   1.2 法定代表人身份证明
   1.3 授权委托书
2. 商务标书
   2.1 公司资质证明
   2.2 财务状况报告
   2.3 项目业绩证明
3. 技术标书
   3.1 技术方案
   3.2 项目组织架构
   3.3 进度计划
   3.4 质量保证措施`;

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template);
    setPreviewDialogOpen(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomCatalog(template.catalogContent);
    }
  };

  return (
    <div className="space-y-6">
      {/* 标书信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">标书信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectName">标书名称 *</Label>
            <Input
              id="projectName"
              value={projectInfo.name}
              onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
              placeholder="请输入标书名称"
            />
          </div>
          <div>
            <Label htmlFor="businessType">业务类型</Label>
            <Select value={projectInfo.type} onValueChange={(value) => setProjectInfo({...projectInfo, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择业务类型" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="knowledgeBase">知识库</Label>
            <Select value={selectedKnowledgeBase} onValueChange={setSelectedKnowledgeBase}>
              <SelectTrigger>
                <SelectValue placeholder="选择知识库" />
              </SelectTrigger>
              <SelectContent>
                {knowledgeBases.map((kb) => (
                  <SelectItem key={kb.value} value={kb.value}>
                    {kb.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="description">项目描述</Label>
          <Textarea
            id="description"
            value={projectInfo.description}
            onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
            placeholder="请简要描述项目需求、技术要求等关键信息..."
            rows={3}
          />
        </div>
      </div>

      {/* 生标设置 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">生标设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              settingsMode === 'auto-parse' 
                ? 'border-sky-600 bg-sky-50' 
                : 'border-gray-200 hover:border-sky-400'
            }`}
            onClick={() => setSettingsMode('auto-parse')}
          >
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-sky-600 mr-2" />
              <h4 className="font-medium">基于招标文件解析</h4>
            </div>
            <p className="text-sm text-gray-600">自动解析招标文件，智能生成投标文件目录</p>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              settingsMode === 'template-based' 
                ? 'border-sky-600 bg-sky-50' 
                : 'border-gray-200 hover:border-sky-400'
            }`}
            onClick={() => setSettingsMode('template-based')}
          >
            <div className="flex items-center mb-2">
              <Settings className="w-5 h-5 text-sky-600 mr-2" />
              <h4 className="font-medium">基于投标模板</h4>
            </div>
            <p className="text-sm text-gray-600">使用现有模板快速创建投标文件结构</p>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              settingsMode === 'custom-create' 
                ? 'border-sky-600 bg-sky-50' 
                : 'border-gray-200 hover:border-sky-400'
            }`}
            onClick={() => setSettingsMode('custom-create')}
          >
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-sky-600 mr-2" />
              <h4 className="font-medium">自定义创建</h4>
            </div>
            <p className="text-sm text-gray-600">完全自定义投标文件目录和结构</p>
          </div>
        </div>
      </div>

      {/* 动态内容区域 */}
      {settingsMode === 'auto-parse' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">文件上传</h3>
          <div className="border-2 border-dashed border-sky-400 rounded-lg p-8 text-center hover:border-sky-600 transition-colors bg-sky-50/30">
            <Upload className="w-12 h-12 text-sky-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">上传招标文件或相关资料</p>
            <Button variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50">选择文件</Button>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <span className="text-xs text-green-600">已上传</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced template-based mode with preview */}
      {settingsMode === 'template-based' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">选择投标模板</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-sky-600 bg-sky-50'
                    : 'border-gray-200 hover:border-sky-400'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-sky-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full mt-1">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                    className="text-gray-500 hover:text-sky-600"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectTemplate(template.id)}
                    className={selectedTemplate === template.id ? "bg-sky-600 hover:bg-sky-700" : ""}
                  >
                    {selectedTemplate === template.id ? '已选择' : '选择'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    预览
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {settingsMode === 'custom-create' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">手动输入目录</h3>
          <div className="relative">
            <Textarea
              value={customCatalog}
              onChange={(e) => {
                if (e.target.value.length <= 10000) {
                  setCustomCatalog(e.target.value);
                }
              }}
              placeholder={catalogReference}
              className="min-h-[400px] resize-none text-sm leading-relaxed border-sky-200 focus:border-sky-600"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {customCatalog.length}/10000
            </div>
          </div>
        </div>
      )}

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
                    handleSelectTemplate(previewTemplate.id);
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
    </div>
  );
};

export default BidSetup;

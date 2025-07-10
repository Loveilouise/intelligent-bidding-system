
import React, { useState } from 'react';
import { Upload, FileText, Settings, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectInfo, UploadedFile } from '@/types/bid';
import TemplateSelectionDialog from './TemplateSelectionDialog';

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

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  catalogContent: string;
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
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateInfo, setSelectedTemplateInfo] = useState<Template | null>(null);

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
  };

  const handleOpenTemplateDialog = () => {
    setTemplateDialogOpen(true);
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplateInfo(template);
    setSelectedTemplate(template.id);
    setCustomCatalog(template.catalogContent);
    
    // Auto-fill project information based on template
    const businessTypeMapping: { [key: string]: string } = {
      '市政工程': 'construction',
      '装修工程': 'construction',
      '系统集成': 'equipment',
      '通用': 'construction',
      '水利工程': 'construction'
    };

    setProjectInfo({
      ...projectInfo,
      name: template.name.replace('模板', ''),
      type: businessTypeMapping[template.category] || 'construction',
      description: template.description
    });

    setTemplateDialogOpen(false);
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

      {/* 编写方式 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">编写方式</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <h4 className="font-medium">按招标文件生成</h4>
            </div>
            <p className="text-sm text-gray-600">自动解析招标文件，智能生成投标文件目录</p>
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
              <h4 className="font-medium">按目录定制生成</h4>
            </div>
            <p className="text-sm text-gray-600">自定义投标文件目录和结构</p>
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

      {settingsMode === 'custom-create' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">手动输入目录</h3>
            <Button 
              variant="outline"
              onClick={handleOpenTemplateDialog}
              className="border-sky-600 text-sky-600 hover:bg-sky-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              使用模板
            </Button>
          </div>
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

      {/* Template Selection Dialog */}
      <TemplateSelectionDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default BidSetup;

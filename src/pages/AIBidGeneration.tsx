
import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Settings, 
  Play, 
  Download, 
  Eye, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Plus,
  Edit3,
  Palette,
  RefreshCw,
  Image,
  Table,
  Save,
  Copy,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectInfo {
  name: string;
  type: string;
  budget: string;
  deadline: string;
  description: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'uploaded' | 'processing' | 'analyzed';
}

interface BidDocument {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'table';
  status: 'draft' | 'generated' | 'edited';
}

const AIBidGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup'); // setup, generation, editing
  const [settingsMode, setSettingsMode] = useState('auto-parse'); // 默认选择基于招标文件解析
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    type: '',
    budget: '',
    deadline: '',
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [bidDocuments, setBidDocuments] = useState<BidDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

  const bidTypes = [
    { value: 'construction', label: '建筑工程' },
    { value: 'equipment', label: '设备采购' },
    { value: 'service', label: '服务类' },
    { value: 'design', label: '设计类' },
    { value: 'consulting', label: '咨询类' }
  ];

  const knowledgeBases = [
    { value: 'enterprise', label: '企业知识库' },
    { value: 'personal', label: '个人知识库' },
    { value: 'uploaded', label: '上传文档（临时）' }
  ];

  const tabs = [
    { id: 'setup', title: '创建标书', description: '标书信息设置和生标配置' },
    { id: 'generation', title: '生成目录', description: '智能生成标书目录结构' },
    { id: 'editing', title: '生成全文', description: '生成完整标书内容并编辑' }
  ];

  const handleNextStep = () => {
    if (activeTab === 'setup') {
      setActiveTab('generation');
      // 开始生成目录
      setGenerationStatus('generating');
      setTimeout(() => {
        setGenerationStatus('completed');
        setBidDocuments([
          { id: '1', title: '技术方案', content: '', type: 'text', status: 'draft' },
          { id: '2', title: '商务方案', content: '', type: 'text', status: 'draft' },
          { id: '3', title: '项目组织架构', content: '', type: 'table', status: 'draft' }
        ]);
      }, 2000);
    } else if (activeTab === 'generation') {
      setActiveTab('editing');
    }
  };

  const renderSetupTab = () => (
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
            <Label htmlFor="projectType">标书类型</Label>
            <Select value={projectInfo.type} onValueChange={(value) => setProjectInfo({...projectInfo, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择标书类型" />
              </SelectTrigger>
              <SelectContent>
                {bidTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="budget">项目预算</Label>
            <Input
              id="budget"
              value={projectInfo.budget}
              onChange={(e) => setProjectInfo({...projectInfo, budget: e.target.value})}
              placeholder="请输入项目预算（万元）"
            />
          </div>
          <div>
            <Label htmlFor="deadline">投标截止时间</Label>
            <Input
              id="deadline"
              type="date"
              value={projectInfo.deadline}
              onChange={(e) => setProjectInfo({...projectInfo, deadline: e.target.value})}
            />
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
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSettingsMode('auto-parse')}
          >
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-purple-500 mr-2" />
              <h4 className="font-medium">基于招标文件解析</h4>
            </div>
            <p className="text-sm text-gray-600">自动解析招标文件，智能生成投标文件目录</p>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              settingsMode === 'template-based' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSettingsMode('template-based')}
          >
            <div className="flex items-center mb-2">
              <Settings className="w-5 h-5 text-purple-500 mr-2" />
              <h4 className="font-medium">基于投标模板</h4>
            </div>
            <p className="text-sm text-gray-600">使用现有模板快速创建投标文件结构</p>
          </div>
          
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              settingsMode === 'custom-create' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSettingsMode('custom-create')}
          >
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-purple-500 mr-2" />
              <h4 className="font-medium">自定义创建</h4>
            </div>
            <p className="text-sm text-gray-600">完全自定义投标文件目录和结构</p>
          </div>
        </div>
      </div>

      {/* 文件上传 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">文件上传</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">上传招标文件或相关资料</p>
          <Button variant="outline">选择文件</Button>
        </div>
        
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <span className="text-xs text-green-600">已上传</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
            下一步
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGenerationTab = () => (
    <div className="space-y-6">
      {/* 生成状态 */}
      {generationStatus === 'generating' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">正在生成标书目录...</h3>
          <p className="text-gray-600">AI正在分析您的需求和上传的文件，请稍候</p>
        </div>
      )}

      {/* 生成的标书目录 */}
      {generationStatus === 'completed' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">生成的标书目录</h3>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加章节
            </Button>
          </div>
          
          <div className="space-y-3">
            {bidDocuments.map((doc, index) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    {doc.type === 'text' && <FileText className="w-5 h-5 text-blue-500" />}
                    {doc.type === 'image' && <Image className="w-5 h-5 text-green-500" />}
                    {doc.type === 'table' && <Table className="w-5 h-5 text-orange-500" />}
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
              生成全文
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderEditingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 文档列表 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">标书章节</h3>
          <div className="space-y-2">
            {bidDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedDocument === doc.id ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedDocument(doc.id)}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{doc.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">内容编辑</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {/* AI生成工具 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Button className="flex flex-col items-center p-4 h-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
              <Sparkles className="w-6 h-6 mb-2" />
              <span className="text-sm">AI生成</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
              <Edit3 className="w-6 h-6 mb-2" />
              <span className="text-sm">AI续写</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
              <RefreshCw className="w-6 h-6 mb-2" />
              <span className="text-sm">AI润色</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200">
              <Palette className="w-6 h-6 mb-2" />
              <span className="text-sm">AI美化</span>
            </Button>
          </div>

          {/* 内容编辑区 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <Textarea
              placeholder="选择左侧章节开始编辑，或使用AI工具生成内容..."
              rows={15}
              className="resize-none"
              value={selectedDocument ? bidDocuments.find(d => d.id === selectedDocument)?.content : ''}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI生标</h1>
          <p className="text-gray-600">智能标书生成系统 - 创建标书 → 生成目录 → 生成全文</p>
        </div>

        {/* 流程步骤指示器 */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-8">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : tabs.findIndex(t => t.id === activeTab) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tabs.findIndex(t => t.id === activeTab) > index ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {tab.title}
                  </span>
                </div>
                {index < tabs.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    tabs.findIndex(t => t.id === activeTab) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="min-h-[600px]">
          {activeTab === 'setup' && renderSetupTab()}
          {activeTab === 'generation' && renderGenerationTab()}
          {activeTab === 'editing' && renderEditingTab()}
        </div>
      </div>
    </div>
  );
};

export default AIBidGeneration;

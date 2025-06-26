
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
  Trash2
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
  const [settingsMode, setSettingsMode] = useState('auto-parse');
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
    { id: 'setup', title: '生标设置', description: '配置生标方式和项目信息' },
    { id: 'generation', title: 'AI生文', description: '生成标书内容' },
    { id: 'editing', title: '标书编辑', description: '续写、润色、美化标书' }
  ];

  const handleStartGeneration = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
      // 模拟生成的标书文档
      setBidDocuments([
        { id: '1', title: '技术方案', content: '基于项目需求，我们制定以下技术方案...', type: 'text', status: 'generated' },
        { id: '2', title: '商务方案', content: '商务条款和报价清单...', type: 'text', status: 'generated' },
        { id: '3', title: '项目组织架构', content: '', type: 'table', status: 'draft' }
      ]);
    }, 3000);
  };

  const renderSetupTab = () => (
    <div className="space-y-6">
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
            <p className="text-sm text-gray-600">自动生成及维护投标文件目录</p>
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
            <p className="text-sm text-gray-600">基于模板新建及维护投标文件目录</p>
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
            <p className="text-sm text-gray-600">自定义新建及维护投标文件目录</p>
          </div>
        </div>

        {settingsMode !== 'auto-parse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>标书类型</Label>
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
          </div>
        )}
      </div>

      {/* 项目信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">项目信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="projectName">项目名称 *</Label>
            <Input
              id="projectName"
              value={projectInfo.name}
              onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
              placeholder="请输入项目名称"
            />
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

      {/* 文件上传 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">文件上传</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-3">上传招标文件或相关资料</p>
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
          <Button onClick={handleStartGeneration} className="bg-purple-600 hover:bg-purple-700">
            开始生成标书目录
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGenerationTab = () => (
    <div className="space-y-6">
      {/* AI生文工具栏 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI生文工具</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>知识库选择</Label>
            <Select defaultValue="enterprise">
              <SelectTrigger>
                <SelectValue />
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
          <div className="space-y-2">
            <Label>生成内容类型</Label>
            <Select defaultValue="text">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">文字内容</SelectItem>
                <SelectItem value="image">项目配图</SelectItem>
                <SelectItem value="table">相关表单</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              生成内容
            </Button>
          </div>
        </div>
      </div>

      {/* 标书文档列表 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">标书文档</h3>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            新建文档
          </Button>
        </div>
        
        <div className="space-y-3">
          {bidDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {doc.type === 'text' && <FileText className="w-5 h-5 text-blue-500" />}
                  {doc.type === 'image' && <Image className="w-5 h-5 text-green-500" />}
                  {doc.type === 'table' && <Table className="w-5 h-5 text-orange-500" />}
                  <span className="font-medium">{doc.title}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doc.status === 'generated' ? 'bg-green-100 text-green-800' :
                    doc.status === 'edited' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.status === 'generated' ? '已生成' : 
                     doc.status === 'edited' ? '已编辑' : '草稿'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {doc.content && (
                <p className="text-sm text-gray-600 line-clamp-2">{doc.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 文档列表 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">文档列表</h3>
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
            <h3 className="font-semibold text-gray-900">标书编辑</h3>
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

          {/* AI编辑工具 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Button className="flex flex-col items-center p-4 h-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
              <Edit3 className="w-6 h-6 mb-2" />
              <span className="text-sm">AI续写</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
              <RefreshCw className="w-6 h-6 mb-2" />
              <span className="text-sm">AI润色</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
              <Palette className="w-6 h-6 mb-2" />
              <span className="text-sm">AI美化</span>
            </Button>
            <Button className="flex flex-col items-center p-4 h-auto bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200">
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm">标书下载</span>
            </Button>
          </div>

          {/* 内容编辑区 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <Textarea
              placeholder="选择左侧文档开始编辑，或使用AI工具生成内容..."
              rows={15}
              className="resize-none"
              value={selectedDocument ? bidDocuments.find(d => d.id === selectedDocument)?.content : ''}
            />
          </div>

          {/* 操作选项 */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium">操作方式：</Label>
              <div className="flex items-center space-x-2">
                <input type="radio" id="insert" name="operation" className="text-purple-600" />
                <Label htmlFor="insert" className="text-sm">插入</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" id="overwrite" name="operation" className="text-purple-600" />
                <Label htmlFor="overwrite" className="text-sm">覆盖</Label>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              可多次生成结果供选择
            </div>
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
          <p className="text-gray-600">基于人工智能技术，智能生成和编辑专业投标方案</p>
        </div>

        {/* 标签导航 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex flex-col items-center">
                    <span>{tab.title}</span>
                    <span className="text-xs text-gray-400 mt-1">{tab.description}</span>
                  </div>
                </button>
              ))}
            </nav>
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

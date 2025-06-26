
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
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Minus,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  level: number;
  children?: BidDocument[];
}

interface CatalogItem {
  id: string;
  title: string;
  level: number;
  children?: CatalogItem[];
}

const AIBidGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');
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
  const [catalogType, setCatalogType] = useState<'business' | 'technical'>('business');
  const [catalogExpanded, setCatalogExpanded] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'requirements' | 'information'>('requirements');
  const [editingTab, setEditingTab] = useState<'cover' | 'business' | 'technical'>('cover');
  const [editingContent, setEditingContent] = useState('');
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([
    { 
      id: '1', 
      title: '商务标书', 
      level: 1,
      children: [
        { id: '1-1', title: '投标函', level: 2 },
        { id: '1-2', title: '法定代表人身份证明', level: 2 },
        { id: '1-3', title: '授权委托书', level: 2 }
      ]
    },
    { id: '2', title: '资质证明文件', level: 1 },
    { id: '3', title: '财务状况报告', level: 1 }
  ]);

  const bidTypes = [
    { value: 'construction', label: '建筑工程' },
    { value: 'equipment', label: '设备采购' },
    { value: 'service', label: '服务类' },
    { value: 'design', label: '设计类' },
    { value: 'consulting', label: '咨询类' }
  ];

  const tabs = [
    { id: 'setup', title: '创建标书', description: '标书信息设置和生标配置' },
    { id: 'generation', title: '生成目录', description: '智能生成标书目录结构' },
    { id: 'editing', title: '生成全文', description: '生成完整标书内容并编辑' }
  ];

  const handleNextStep = () => {
    if (activeTab === 'setup') {
      setActiveTab('generation');
      setGenerationStatus('generating');
      setTimeout(() => {
        setGenerationStatus('completed');
        setBidDocuments([
          { id: '1', title: '技术方案', content: '', type: 'text', status: 'draft', level: 1 },
          { id: '2', title: '商务方案', content: '', type: 'text', status: 'draft', level: 1 },
          { id: '3', title: '项目组织架构', content: '', type: 'table', status: 'draft', level: 1 }
        ]);
      }, 2000);
    } else if (activeTab === 'generation') {
      setActiveTab('editing');
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'generation') {
      setActiveTab('setup');
    } else if (activeTab === 'editing') {
      setActiveTab('generation');
    }
  };

  const handleToggleExpand = () => {
    setCatalogExpanded(!catalogExpanded);
  };

  const handleRegenerateCatalog = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
    }, 1500);
  };

  const addSameLevelItem = (parentId: string | null, afterId: string) => {
    console.log('Adding same level item after:', afterId);
  };

  const addSubLevelItem = (parentId: string) => {
    console.log('Adding sub level item under:', parentId);
  };

  const deleteItem = (itemId: string) => {
    console.log('Deleting item:', itemId);
  };

  const renderCatalogItem = (item: CatalogItem, parentId: string | null = null) => {
    if (!catalogExpanded && item.level > 1) {
      return null;
    }

    return (
      <div key={item.id} className="group">
        <div 
          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
          style={{ paddingLeft: `${item.level * 16 + 8}px` }}
        >
          <span className="text-sm">{item.title}</span>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onMouseEnter={(e) => {
                        const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                        if (dropdown) {
                          dropdown.style.display = 'block';
                        }
                      }}
                      onMouseLeave={(e) => {
                        setTimeout(() => {
                          const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                          if (dropdown && !dropdown.matches(':hover')) {
                            dropdown.style.display = 'none';
                          }
                        }, 100);
                      }}
                    >
                      <Plus className="h-3 w-3 text-gray-900" />
                    </Button>
                    <div 
                      className="absolute left-0 top-8 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-32"
                      style={{ display: 'none' }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.display = 'block';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    >
                      <button
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 whitespace-nowrap text-gray-900"
                        onClick={() => {
                          addSameLevelItem(parentId, item.id);
                          document.querySelectorAll('[style*="display: block"]').forEach(el => {
                            (el as HTMLElement).style.display = 'none';
                          });
                        }}
                      >
                        创建同级章节
                      </button>
                      <button
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 whitespace-nowrap text-gray-900"
                        onClick={() => {
                          addSubLevelItem(item.id);
                          document.querySelectorAll('[style*="display: block"]').forEach(el => {
                            (el as HTMLElement).style.display = 'none';
                          });
                        }}
                      >
                        创建子级章节
                      </button>
                    </div>
                  </div>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                  <Trash2 className="h-3 w-3 text-gray-900" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要删除"{item.title}"吗？此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteItem(item.id)}>删除</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {catalogExpanded && item.children && item.children.map(child => renderCatalogItem(child, item.id))}
      </div>
    );
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
      </div>
    </div>
  );

  const renderGenerationTab = () => (
    <div className="space-y-6">
      {generationStatus === 'generating' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">正在生成标书目录...</h3>
          <p className="text-gray-600">AI正在分析您的需求和上传的文件，请稍候</p>
        </div>
      )}

      {generationStatus === 'completed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* 左侧目录 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
              {/* 目录标题和切换 */}
              <div className="border-b border-gray-200 p-4">
                <Tabs value={catalogType} onValueChange={(value) => setCatalogType(value as 'business' | 'technical')}>
                  <TabsList className="grid w-fit grid-cols-2">
                    <TabsTrigger value="business">商务标</TabsTrigger>
                    <TabsTrigger value="technical">技术标</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 操作按钮栏 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleToggleExpand}>
                    {catalogExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新生成
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认重新生成</AlertDialogTitle>
                      <AlertDialogDescription>
                        重新生成将覆盖当前目录，确定要继续吗？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRegenerateCatalog}>确认</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* 目录内容 */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {catalogItems.map(item => renderCatalogItem(item))}
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息面板 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
              <Tabs value={rightPanelTab} onValueChange={(value) => setRightPanelTab(value as 'requirements' | 'information')}>
                <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                  <TabsTrigger value="requirements">招标要求</TabsTrigger>
                  <TabsTrigger value="information">招标信息</TabsTrigger>
                </TabsList>
                
                <TabsContent value="requirements" className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">技术要求</h4>
                      <p className="text-sm text-gray-600">
                        项目需要满足国家相关技术标准，具备完整的技术方案和实施计划...
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">资质要求</h4>
                      <p className="text-sm text-gray-600">
                        投标人应具备相应的资质证书，有类似项目经验...
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">商务要求</h4>
                      <p className="text-sm text-gray-600">
                        投标保证金、履约保证金等商务要求...
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="information" className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">项目概况</h4>
                      <p className="text-sm text-gray-600">
                        项目名称、建设地点、建设规模等基本信息...
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">投标须知</h4>
                      <p className="text-sm text-gray-600">
                        投标文件编制要求、提交方式、开标时间等...
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">评标办法</h4>
                      <p className="text-sm text-gray-600">
                        评标标准、评分细则、中标条件等...
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEditingTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
      {/* 左侧导航 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 h-full">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">文档结构</h3>
          </div>
          <Tabs value={editingTab} onValueChange={(value) => setEditingTab(value as 'cover' | 'business' | 'technical')}>
            <TabsList className="grid w-full grid-cols-1 m-4 mb-0">
              <TabsTrigger value="cover">封面</TabsTrigger>
              <TabsTrigger value="business">商务标</TabsTrigger>
              <TabsTrigger value="technical">技术标</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 中间编辑区域 */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
          {/* Word工具栏 */}
          <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
            <Button variant="ghost" size="sm">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Select defaultValue="16">
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 编辑内容区 */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="min-h-full bg-white">
              <Textarea
                placeholder="开始编辑您的标书内容..."
                className="w-full h-full min-h-[500px] border-none resize-none focus:ring-0 text-base leading-relaxed"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 右侧AI工具 */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 h-full p-4">
          <h3 className="font-semibold text-gray-900 mb-4">AI助手</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              AI生成
            </Button>
            <Button className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
              <Edit3 className="w-4 h-4 mr-2" />
              AI续写
            </Button>
            <Button className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              AI润色
            </Button>
            <Button className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200">
              <Palette className="w-4 h-4 mr-2" />
              AI美化
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和流程指示器 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">AI生标</h1>
          
          {/* 流程步骤指示器 */}
          <div className="flex items-center space-x-6">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white' 
                      : tabs.findIndex(t => t.id === activeTab) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tabs.findIndex(t => t.id === activeTab) > index ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {tab.title}
                  </span>
                </div>
                {index < tabs.length - 1 && (
                  <div className={`w-8 h-0.5 mx-3 ${
                    tabs.findIndex(t => t.id === activeTab) > index ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            {activeTab !== 'setup' && (
              <Button variant="outline" onClick={handlePrevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            )}
            {activeTab === 'setup' && (
              <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {activeTab === 'generation' && (
              <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            {activeTab === 'editing' && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                提交
              </Button>
            )}
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

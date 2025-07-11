import React, { useState } from 'react';
import { Clock, CheckCircle, Save, ArrowLeft, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BidSetup from '@/components/BidSetup';
import BidGeneration from '@/components/BidGeneration';
import BidEditing from '@/components/BidEditing';
import DownloadSettingsDialog from '@/components/DownloadSettingsDialog';
import { ProjectInfo, UploadedFile, CatalogItem } from '@/types/bid';
import { useToast } from '@/hooks/use-toast';
import CatalogItemComponent from '@/components/CatalogItem';

interface AIBidGenerationProps {
  showHeaderControls?: boolean;
  onBack?: () => void;
}

const AIBidGeneration: React.FC<AIBidGenerationProps> = ({ 
  showHeaderControls = false, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState('setup');
  const [settingsMode, setSettingsMode] = useState('auto-parse');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    type: '',
    description: ''
  });
  const [uploadedFiles] = useState<UploadedFile[]>([]);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [fullTextGenerationStatus, setFullTextGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [catalogType, setCatalogType] = useState<'business' | 'technical'>('business');
  const [catalogExpanded, setCatalogExpanded] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'requirements' | 'information'>('requirements');
  const [editingTab, setEditingTab] = useState<'cover' | 'business' | 'technical'>('cover');
  const [editingContent, setEditingContent] = useState('');
  const [customCatalog, setCustomCatalog] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('');
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([
    { 
      id: '1', 
      title: '商务标书', 
      level: 1,
      expanded: true,
      children: [
        { id: '1-1', title: '投标函', level: 2 },
        { id: '1-2', title: '法定代表人身份证明', level: 2 },
        { id: '1-3', title: '授权委托书', level: 2 }
      ]
    },
    { id: '2', title: '资质证明文件', level: 1, expanded: true },
    { id: '3', title: '财务状况报告', level: 1, expanded: true }
  ]);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [currentGenerateItem, setCurrentGenerateItem] = useState<{ id: string, title: string } | null>(null);
  const [fullTextCatalogType, setFullTextCatalogType] = useState<'business' | 'technical'>('technical');
  const [fullTextExpanded, setFullTextExpanded] = useState(true);
  const { toast } = useToast();

  // Sample data for full text generation
  const [fullTextBusinessCatalog] = useState<CatalogItem[]>([
    { 
      id: 'fb1', 
      title: '投标函', 
      level: 1,
      expanded: true,
      wordCount: 1000,
      children: [
        { id: 'fb1-1', title: '投标函', level: 2, wordCount: 1000 },
        { id: 'fb1-2', title: '法定代表人身份证明', level: 2, wordCount: 1000 },
        { id: 'fb1-3', title: '授权委托书', level: 2, wordCount: 1000 }
      ]
    },
    { id: 'fb2', title: '资质证明文件', level: 1, expanded: true, wordCount: 1000 },
    { id: 'fb3', title: '财务状况报告', level: 1, expanded: true, wordCount: 1000 }
  ]);

  const [fullTextTechnicalCatalog] = useState<CatalogItem[]>([
    { 
      id: 'ft1', 
      title: '技术方案', 
      level: 1,
      expanded: true,
      wordCount: 1000,
      children: [
        { id: 'ft1-1', title: '总体技术方案', level: 2, wordCount: 1000 },
        { id: 'ft1-2', title: '技术路线', level: 2, wordCount: 1000 },
        { id: 'ft1-3', title: '关键技术', level: 2, wordCount: 1000 }
      ]
    },
    { id: 'ft2', title: '项目组织架构', level: 1, expanded: true, wordCount: 1000 },
    { id: 'ft3', title: '进度计划', level: 1, expanded: true, wordCount: 1000 },
    { id: 'ft4', title: '质量保证措施', level: 1, expanded: true, wordCount: 1000 }
  ]);

  const tabs = [
    { id: 'setup', title: '创建标书' },
    { id: 'generation', title: '生成目录' },
    { id: 'editing', title: '生成全文' }
  ];

  const handleNextStep = () => {
    if (activeTab === 'setup') {
      setActiveTab('generation');
      setGenerationStatus('generating');
      setTimeout(() => {
        setGenerationStatus('completed');
      }, 2000);
    } else if (activeTab === 'generation') {
      setFullTextGenerationStatus('generating');
      setTimeout(() => {
        setFullTextGenerationStatus('completed');
        setActiveTab('editing');
        setCurrentWordCount(8543);
      }, 3000);
    }
  };

  const handlePrevStep = () => {
    if (activeTab === 'generation') {
      setActiveTab('setup');
    } else if (activeTab === 'editing') {
      setActiveTab('generation');
      setFullTextGenerationStatus('idle');
    }
  };

  const handleGenerate = (itemId: string, title: string) => {
    setCurrentGenerateItem({ id: itemId, title });
    setGenerateDialogOpen(true);
  };

  const handleConfirmGenerate = () => {
    if (currentGenerateItem) {
      // TODO: Implement actual generation logic
      console.log(`Generating content for: ${currentGenerateItem.title}`);
      toast({
        title: "开始生成",
        description: `正在生成"${currentGenerateItem.title}"的内容...`,
      });
    }
    setGenerateDialogOpen(false);
    setCurrentGenerateItem(null);
  };

  const handleRegenerateCatalog = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
    }, 1500);
  };

  const handleDownload = () => {
    setDownloadDialogOpen(true);
  };

  const handleActualDownload = () => {
    console.log('执行下载操作');
    setDownloadDialogOpen(false);
  };

  const handleAutoSave = () => {
    toast({
      title: "文档保存成功",
      description: "您的标书内容已自动保存",
    });
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  if (fullTextGenerationStatus === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50">
        {showHeaderControls && (
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={handleBackClick}
                    className="mr-4 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回
                  </Button>
                  <h1 className="text-lg font-semibold text-gray-900 mr-6">创建标书</h1>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">已自动保存</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAutoSave}
                      className="h-6 w-6 p-0"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {tabs.map((tab, index) => (
                    <div key={tab.id} className="flex items-center">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          activeTab === tab.id 
                            ? 'bg-sky-600 text-white' 
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
                          activeTab === tab.id ? 'text-sky-600' : 'text-gray-500'
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

                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={handlePrevStep}>
                    上一步
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`flex-1 ${showHeaderControls ? 'pt-20' : ''}`}>
          <div className="max-w-7xl mx-auto h-full flex">
            {/* 左侧目录 */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">目录</h3>
                <Tabs value={fullTextCatalogType} onValueChange={(value) => setFullTextCatalogType(value as 'business' | 'technical')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="business">商务标</TabsTrigger>
                    <TabsTrigger value="technical">技术标</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="business" className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFullTextExpanded(!fullTextExpanded)}
                      >
                        {fullTextExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    {fullTextExpanded && (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {fullTextBusinessCatalog.map(item => (
                          <CatalogItemComponent
                            key={item.id}
                            item={item}
                            onToggleExpansion={() => {}}
                            onAddSameLevel={() => {}}
                            onAddSubLevel={() => {}}
                            onDelete={() => {}}
                            showWordCount={false}
                            showGenerateButton={false}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="technical" className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFullTextExpanded(!fullTextExpanded)}
                      >
                        {fullTextExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    {fullTextExpanded && (
                      <div className="space-y-1 max-h-96 overflow-y-auto">
                        {fullTextTechnicalCatalog.map(item => (
                          <CatalogItemComponent
                            key={item.id}
                            item={item}
                            onToggleExpansion={() => {}}
                            onAddSameLevel={() => {}}
                            onAddSubLevel={() => {}}
                            onDelete={() => {}}
                            onGenerate={handleGenerate}
                            showWordCount={true}
                            showGenerateButton={true}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* 右侧内容区域 */}
            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[600px] flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">正在生成全文</h2>
                  <p className="text-gray-600 mb-4">AI正在根据目录结构生成完整的标书内容...</p>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    预计需要2-3分钟
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 控制组件 - 只在独立页面显示，在CreateBidFlow中会被移到顶部 */}
        {!showHeaderControls && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">创建标书</h1>
              <div className="flex items-center ml-6">
                <span className="text-sm text-gray-600 mr-2">已自动保存</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoSave}
                  className="h-6 w-6 p-0"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      activeTab === tab.id 
                        ? 'bg-sky-600 text-white' 
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
                      activeTab === tab.id ? 'text-sky-600' : 'text-gray-500'
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

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {activeTab === 'editing' && (
                  <span className="text-sm text-gray-600">
                    当前字数：{currentWordCount.toLocaleString()}
                  </span>
                )}
                {activeTab !== 'setup' && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    上一步
                  </Button>
                )}
                {activeTab === 'editing' && (
                  <Button onClick={handleDownload} className="bg-sky-600 hover:bg-sky-700">
                    下载标书
                  </Button>
                )}
                {activeTab === 'setup' && (
                  <Button onClick={handleNextStep} className="bg-sky-600 hover:bg-sky-700">
                    下一步
                  </Button>
                )}
                {activeTab === 'generation' && (
                  <Button onClick={handleNextStep} className="bg-sky-600 hover:bg-sky-700">
                    下一步
                  </Button>
                )}
              </div>
            </div>
          </div>
      )}
      
      {/* Generate Confirmation Dialog */}
      <AlertDialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认生成</AlertDialogTitle>
            <AlertDialogDescription>
              整章生成会替换已经生成的内容，确定生成吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate} className="bg-sky-600 hover:bg-sky-700">
              立即生成
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

        {/* 在CreateBidFlow中显示的控制组件 */}
        {showHeaderControls && (
          <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={handleBackClick}
                    className="mr-4 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回
                  </Button>
                  <h1 className="text-lg font-semibold text-gray-900 mr-6">创建标书</h1>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">已自动保存</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAutoSave}
                      className="h-6 w-6 p-0"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  {tabs.map((tab, index) => (
                    <div key={tab.id} className="flex items-center">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          activeTab === tab.id 
                            ? 'bg-sky-600 text-white' 
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
                          activeTab === tab.id ? 'text-sky-600' : 'text-gray-500'
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

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {activeTab === 'editing' && (
                      <span className="text-sm text-gray-600">
                        当前字数：{currentWordCount.toLocaleString()}
                      </span>
                    )}
                    {activeTab !== 'setup' && (
                      <Button variant="outline" onClick={handlePrevStep}>
                        上一步
                      </Button>
                    )}
                    {activeTab === 'editing' && (
                      <Button onClick={handleDownload} className="bg-sky-600 hover:bg-sky-700">
                        下载标书
                      </Button>
                    )}
                    {activeTab === 'setup' && (
                      <Button onClick={handleNextStep} className="bg-sky-600 hover:bg-sky-700">
                        下一步
                      </Button>
                    )}
                    {activeTab === 'generation' && (
                      <Button onClick={handleNextStep} className="bg-sky-600 hover:bg-sky-700">
                        下一步
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 内容区域 - 在使用顶部控制时需要加上顶部边距 */}
        <div className={`min-h-[600px] ${showHeaderControls ? 'pt-20' : ''}`}>
          {activeTab === 'setup' && (
            <BidSetup
              projectInfo={projectInfo}
              setProjectInfo={setProjectInfo}
              settingsMode={settingsMode}
              setSettingsMode={setSettingsMode}
              uploadedFiles={uploadedFiles}
              customCatalog={customCatalog}
              setCustomCatalog={setCustomCatalog}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              selectedKnowledgeBase={selectedKnowledgeBase}
              setSelectedKnowledgeBase={setSelectedKnowledgeBase}
            />
          )}
          {activeTab === 'generation' && (
            <BidGeneration
              generationStatus={generationStatus}
              catalogType={catalogType}
              setCatalogType={setCatalogType}
              catalogExpanded={catalogExpanded}
              setCatalogExpanded={setCatalogExpanded}
              rightPanelTab={rightPanelTab}
              setRightPanelTab={setRightPanelTab}
              catalogItems={catalogItems}
              setCatalogItems={setCatalogItems}
              onRegenerateCatalog={handleRegenerateCatalog}
            />
          )}
          {activeTab === 'editing' && (
            <BidEditing 
              editingTab={editingTab}
              setEditingTab={setEditingTab}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              catalogItems={catalogItems}
              setCatalogItems={setCatalogItems}
            />
          )}
        </div>
        
        <DownloadSettingsDialog
          open={downloadDialogOpen}
          onOpenChange={setDownloadDialogOpen}
          onDownload={handleActualDownload}
        />
      </div>
    </div>
  );
};

export default AIBidGeneration;

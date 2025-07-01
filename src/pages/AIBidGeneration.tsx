import React, { useState } from 'react';
import { Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidSetup from '@/components/BidSetup';
import BidGeneration from '@/components/BidGeneration';
import BidEditing from '@/components/BidEditing';
import { ProjectInfo, UploadedFile, CatalogItem } from '@/types/bid';

const AIBidGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [settingsMode, setSettingsMode] = useState('auto-parse');
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    type: '',
    description: ''
  });
  const [uploadedFiles] = useState<UploadedFile[]>([]);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
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

  const handleRegenerateCatalog = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题和流程指示器 */}
        <div className="flex items-center justify-between mb-4">
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
              </Button>
            )}
            {activeTab === 'generation' && (
              <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                下一步
              </Button>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="min-h-[600px]">
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIBidGeneration;

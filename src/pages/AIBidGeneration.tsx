
import React, { useState } from 'react';
import BidSetup from '@/components/BidSetup';
import BidGeneration from '@/components/BidGeneration';
import BidEditing from '@/components/BidEditing';
import DownloadSettingsDialog from '@/components/DownloadSettingsDialog';
import AIBidGenerationHeader from '@/components/AIBidGenerationHeader';
import FullTextGenerationLoader from '@/components/FullTextGenerationLoader';
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

  const handleRegenerateCatalog = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
    }, 1500);
  };

  const handleSave = () => {
    console.log('保存标书');
  };

  const handleDownload = () => {
    setDownloadDialogOpen(true);
  };

  const handleActualDownload = () => {
    console.log('执行下载操作');
    setDownloadDialogOpen(false);
  };

  // 生成全文动画页面
  if (fullTextGenerationStatus === 'generating') {
    return (
      <FullTextGenerationLoader
        tabs={tabs}
        activeTab={activeTab}
        onPrevStep={handlePrevStep}
      />
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <AIBidGenerationHeader
          tabs={tabs}
          activeTab={activeTab}
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
          onSave={handleSave}
          onDownload={handleDownload}
        />

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

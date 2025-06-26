
import React, { useState } from 'react';
import { Upload, FileText, Settings, Play, Download, Eye, Sparkles, Clock, CheckCircle, Plus } from 'lucide-react';
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

const AIBidGeneration: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [settingsMode, setSettingsMode] = useState('auto-parse'); // 生标设置模式
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: '',
    type: '',
    budget: '',
    deadline: '',
    description: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');

  const steps = [
    { id: 1, title: '生标设置', description: '选择生标方式和配置' },
    { id: 2, title: '项目信息', description: '填写基本项目信息' },
    { id: 3, title: '文件上传', description: '上传招标相关文件' },
    { id: 4, title: 'AI配置', description: '配置生成参数' },
    { id: 5, title: '生成标书', description: 'AI智能生成投标文件' }
  ];

  const bidTypes = [
    { value: 'construction', label: '建筑工程' },
    { value: 'equipment', label: '设备采购' },
    { value: 'service', label: '服务类' },
    { value: 'design', label: '设计类' },
    { value: 'consulting', label: '咨询类' }
  ];

  const handleStartGeneration = () => {
    setGenerationStatus('generating');
    setTimeout(() => {
      setGenerationStatus('completed');
    }, 5000);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">选择生标方式</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <p className="text-sm text-gray-600">上传招标文件，系统自动解析并生成投标文件目录结构</p>
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
                  <p className="text-sm text-gray-600">选择预设的投标模板创建投标文件目录</p>
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
                  <p className="text-sm text-gray-600">完全自定义创建投标文件目录结构</p>
                </div>
              </div>
            </div>

            {/* 根据选择的模式显示相应的配置选项 */}
            {settingsMode === 'auto-parse' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">自动解析模式说明</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 系统将自动解析上传的招标文件</li>
                  <li>• 根据文件内容自动识别标书类型</li>
                  <li>• 智能生成对应的投标文件目录结构</li>
                  <li>• 推荐用于标准化的招标项目</li>
                </ul>
              </div>
            )}

            {settingsMode === 'template-based' && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">选择投标模板</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer">
                    <h5 className="font-medium mb-2">建筑工程模板</h5>
                    <p className="text-sm text-gray-500 mb-3">适用于建筑施工类项目</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">建筑工程</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer">
                    <h5 className="font-medium mb-2">设备采购模板</h5>
                    <p className="text-sm text-gray-500 mb-3">适用于设备采购类项目</p>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">设备采购</span>
                  </div>
                </div>
              </div>
            )}

            {settingsMode === 'custom-create' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customProjectType">标书类型</Label>
                  <Select>
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
                  <Label htmlFor="customStructure">目录结构配置</Label>
                  <Textarea
                    id="customStructure"
                    placeholder="请配置投标文件目录结构..."
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称 *</Label>
                <Input
                  id="projectName"
                  value={projectInfo.name}
                  onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})}
                  placeholder="请输入项目名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType">项目类型 *</Label>
                <Select 
                  value={projectInfo.type} 
                  onValueChange={(value) => setProjectInfo({...projectInfo, type: value})}
                  disabled={settingsMode === 'auto-parse'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={settingsMode === 'auto-parse' ? '将自动识别' : '选择项目类型'} />
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
              <div className="space-y-2">
                <Label htmlFor="budget">项目预算</Label>
                <Input
                  id="budget"
                  value={projectInfo.budget}
                  onChange={(e) => setProjectInfo({...projectInfo, budget: e.target.value})}
                  placeholder="请输入项目预算（万元）"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">投标截止时间</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectInfo.deadline}
                  onChange={(e) => setProjectInfo({...projectInfo, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">项目描述</Label>
              <Textarea
                id="description"
                value={projectInfo.description}
                onChange={(e) => setProjectInfo({...projectInfo, description: e.target.value})}
                placeholder="请简要描述项目需求、技术要求等关键信息..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">上传招标文件</h3>
              <p className="text-gray-500 mb-4">支持 PDF, DOC, DOCX, XLS, XLSX 格式</p>
              <Button variant="outline" className="mb-2">
                选择文件
              </Button>
              <p className="text-xs text-gray-400">或拖拽文件到此区域</p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">已上传文件</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.status === 'analyzed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已分析
                        </span>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>生成模式</Label>
                <Select defaultValue="intelligent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intelligent">智能模式（推荐）</SelectItem>
                    <SelectItem value="conservative">保守模式</SelectItem>
                    <SelectItem value="aggressive">积极模式</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>技术方案重点</Label>
                <Select defaultValue="technical">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">技术先进性</SelectItem>
                    <SelectItem value="cost">成本优势</SelectItem>
                    <SelectItem value="experience">项目经验</SelectItem>
                    <SelectItem value="quality">质量保证</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>自定义要求</Label>
              <Textarea
                placeholder="请输入特殊要求或重点突出的内容..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">AI分析结果</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 生标方式：{settingsMode === 'auto-parse' ? '基于招标文件解析' : settingsMode === 'template-based' ? '基于投标模板' : '自定义创建'}</li>
                <li>• 检测到{projectInfo.type ? bidTypes.find(t => t.value === projectInfo.type)?.label : '待识别'}类项目</li>
                <li>• 识别出5个主要技术要求点</li>
                <li>• 发现3个关键评分标准</li>
                <li>• 预估生成时间：3-5分钟</li>
              </ul>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {generationStatus === 'idle' && (
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">准备生成投标文件</h3>
                <p className="text-gray-600 mb-6">AI将根据您的设置和配置智能生成专业的投标文件</p>
                <Button onClick={handleStartGeneration} size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Play className="w-5 h-5 mr-2" />
                  开始生成
                </Button>
              </div>
            )}

            {generationStatus === 'generating' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI正在生成中...</h3>
                <p className="text-gray-600 mb-6">请稍候，预计需要3-5分钟</p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {generationStatus === 'completed' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">生成完成</h3>
                  <p className="text-gray-600">投标文件已成功生成，请查看和下载</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">技术方案</h4>
                    <p className="text-sm text-gray-600 mb-3">包含施工组织设计、技术措施等</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        预览
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">商务文件</h4>
                    <p className="text-sm text-gray-600 mb-3">包含报价清单、商务条款等</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        预览
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline">保存为模板</Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    下载完整标书
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI生标</h1>
          <p className="text-gray-600">基于人工智能技术，智能分析招标文件并生成专业投标方案</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  activeStep >= step.id 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {activeStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 text-left">
                  <p className={`text-sm font-medium ${
                    activeStep >= step.id ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    activeStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStepContent()}

          {/* 底部按钮 */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
            >
              上一步
            </Button>
            <Button 
              onClick={() => setActiveStep(Math.min(5, activeStep + 1))}
              disabled={activeStep === 5}
              className="bg-purple-600 hover:bg-purple-700"
            >
              下一步
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBidGeneration;

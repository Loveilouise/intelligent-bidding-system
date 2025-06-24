
import React, { useState } from 'react';
import { Upload, FileText, Settings, Plus } from 'lucide-react';

const BidSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('auto-parse');

  const tabs = [
    { id: 'auto-parse', name: '基于招标文件解析' },
    { id: 'template-based', name: '基于投标模板' },
    { id: 'custom-create', name: '自定义创建' }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">生标设置</h1>
          <p className="text-gray-600">配置和管理投标文件目录生成方式</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'auto-parse' && (
            <div>
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold">基于招标文件解析</h2>
              </div>
              <p className="text-gray-600 mb-6">上传招标文件，系统将自动解析并生成相应的投标文件目录结构。标书类型将根据招标文件自动识别。</p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">上传招标文件</h3>
                <p className="text-gray-500 mb-4">支持 PDF, DOC, DOCX 格式文件</p>
                <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  选择文件
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">已解析项目</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">某公司办公楼建设项目</h4>
                      <p className="text-sm text-gray-500">建筑工程类 • 2024-06-24</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700">管理目录</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'template-based' && (
            <div>
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold">基于投标模板</h2>
              </div>
              <p className="text-gray-600 mb-6">选择预设的投标模板创建投标文件目录，可手动选择标书类型。</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-2">建筑工程模板</h3>
                  <p className="text-sm text-gray-500 mb-3">适用于建筑施工类项目</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">建筑工程</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-2">设备采购模板</h3>
                  <p className="text-sm text-gray-500 mb-3">适用于设备采购类项目</p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">设备采购</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-2">服务类模板</h3>
                  <p className="text-sm text-gray-500 mb-3">适用于服务类项目</p>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">服务类</span>
                </div>
              </div>

              <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                新建模板
              </button>
            </div>
          )}

          {activeTab === 'custom-create' && (
            <div>
              <div className="flex items-center mb-4">
                <Plus className="w-6 h-6 text-purple-500 mr-2" />
                <h2 className="text-lg font-semibold">自定义创建</h2>
              </div>
              <p className="text-gray-600 mb-6">完全自定义创建投标文件目录结构，可手动选择标书类型和配置所有参数。</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">项目名称</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="请输入项目名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标书类型</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">请选择标书类型</option>
                    <option value="construction">建筑工程</option>
                    <option value="equipment">设备采购</option>
                    <option value="service">服务类</option>
                    <option value="design">设计类</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目录结构</label>
                  <div className="border border-gray-300 rounded-lg p-4 min-h-32">
                    <p className="text-gray-500 text-sm">请配置投标文件目录结构...</p>
                  </div>
                </div>

                <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  创建目录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidSettings;

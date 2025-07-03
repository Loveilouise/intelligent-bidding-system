import React, { useState } from 'react';
import { Plus, Settings, ExternalLink, Search, Edit, Trash2, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Industry {
  id: string;
  name: string;
  description: string;
  category: string;
  dataCount: number;
  lastSync: string;
  status: 'active' | 'inactive' | 'syncing';
  hasExternalSystem: boolean;
  externalSystemUrl?: string;
}

interface IndustryData {
  id: string;
  title: string;
  category: string;
  source: string;
  updateTime: string;
  status: 'available' | 'outdated' | 'processing';
}

const IndustryKnowledge: React.FC = () => {
  const [activeTab, setActiveTab] = useState('industries');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const [industries] = useState<Industry[]>([
    {
      id: '1',
      name: '建筑工程',
      description: '建筑工程行业相关标准、规范和技术文档',
      category: '工程建设',
      dataCount: 1256,
      lastSync: '2024-03-15 10:30',
      status: 'active',
      hasExternalSystem: true,
      externalSystemUrl: 'https://example-construction.com/api'
    },
    {
      id: '2',
      name: '信息技术',
      description: 'IT行业技术标准、开发规范和最佳实践',
      category: '信息科技',
      dataCount: 892,
      lastSync: '2024-03-14 15:45',
      status: 'active',
      hasExternalSystem: false
    },
    {
      id: '3',
      name: '医疗健康',
      description: '医疗器械、药品监管和临床标准',
      category: '医疗卫生',
      dataCount: 567,
      lastSync: '2024-03-13 09:20',
      status: 'syncing',
      hasExternalSystem: true,
      externalSystemUrl: 'https://medical-standards.gov.cn/api'
    }
  ]);

  const [industryData] = useState<IndustryData[]>([
    {
      id: '1',
      title: '建筑工程施工质量验收统一标准',
      category: '质量标准',
      source: '国家建设部',
      updateTime: '2024-03-15',
      status: 'available'
    },
    {
      id: '2',
      title: '混凝土结构工程施工规范',
      category: '施工规范',
      source: '中国建筑标准设计研究院',
      updateTime: '2024-03-14',
      status: 'available'
    },
    {
      id: '3',
      title: '建筑装饰装修工程质量验收规范',
      category: '验收标准',
      source: '住房和城乡建设部',
      updateTime: '2024-03-10',
      status: 'outdated'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">运行中</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">已停用</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-800">同步中</Badge>;
      case 'available':
        return <Badge className="bg-green-100 text-green-800">可用</Badge>;
      case 'outdated':
        return <Badge className="bg-yellow-100 text-yellow-800">需更新</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">处理中</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const handleCreateIndustry = () => {
    console.log('创建行业知识库');
  };

  const handleSyncData = (industryId: string) => {
    console.log('同步数据:', industryId);
  };

  const handleConnectSystem = () => {
    console.log('连接外部系统');
  };

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    industry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredData = industryData.filter(data =>
    data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">行业知识库</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              系统对接
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  创建行业库
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>创建行业知识库</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="industry-name">行业名称</Label>
                    <Input id="industry-name" placeholder="请输入行业名称" />
                  </div>
                  <div>
                    <Label htmlFor="industry-category">行业分类</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择行业分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">工程建设</SelectItem>
                        <SelectItem value="technology">信息科技</SelectItem>
                        <SelectItem value="medical">医疗卫生</SelectItem>
                        <SelectItem value="finance">金融服务</SelectItem>
                        <SelectItem value="manufacturing">制造业</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="industry-desc">行业描述</Label>
                    <Textarea id="industry-desc" placeholder="请输入行业描述信息" />
                  </div>
                  <div>
                    <Label htmlFor="external-url">外部系统API</Label>
                    <Input id="external-url" placeholder="https://example.com/api（可选）" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">取消</Button>
                    <Button onClick={handleCreateIndustry} className="flex-1 bg-purple-600 hover:bg-purple-700">创建</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="industries">行业管理</TabsTrigger>
            <TabsTrigger value="data">数据浏览</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>

          <TabsContent value="industries" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>行业知识库列表</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="搜索行业..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>行业名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>数据量</TableHead>
                      <TableHead>最后同步</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>外部系统</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIndustries.map((industry) => (
                      <TableRow key={industry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{industry.name}</div>
                            <div className="text-sm text-gray-500">{industry.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{industry.category}</TableCell>
                        <TableCell>{industry.dataCount.toLocaleString()}</TableCell>
                        <TableCell>{industry.lastSync}</TableCell>
                        <TableCell>{getStatusBadge(industry.status)}</TableCell>
                        <TableCell>
                          {industry.hasExternalSystem ? (
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4 text-green-500" />
                              <span className="text-sm">已连接</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">未连接</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSyncData(industry.id)}>
                              <Database className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>行业数据浏览</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="construction">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">建筑工程</SelectItem>
                        <SelectItem value="technology">信息技术</SelectItem>
                        <SelectItem value="medical">医疗健康</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="搜索数据..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>标题</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>数据源</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="font-medium">{data.title}</TableCell>
                        <TableCell>{data.category}</TableCell>
                        <TableCell>{data.source}</TableCell>
                        <TableCell>{data.updateTime}</TableCell>
                        <TableCell>{getStatusBadge(data.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  外部系统配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-endpoint">API端点</Label>
                  <Input id="api-endpoint" placeholder="https://api.example.com" />
                </div>
                <div>
                  <Label htmlFor="api-key">API密钥</Label>
                  <Input id="api-key" type="password" placeholder="输入API密钥" />
                </div>
                <div>
                  <Label htmlFor="sync-interval">同步间隔（小时）</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1小时</SelectItem>
                      <SelectItem value="6">6小时</SelectItem>
                      <SelectItem value="12">12小时</SelectItem>
                      <SelectItem value="24">24小时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">测试连接</Button>
                  <Button onClick={handleConnectSystem} className="bg-purple-600 hover:bg-purple-700">保存配置</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IndustryKnowledge;
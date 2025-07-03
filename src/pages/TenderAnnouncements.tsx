import React, { useState } from 'react';
import { Search, Filter, Settings, ExternalLink, Download, Calendar, MapPin, Building2, Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

interface TenderAnnouncement {
  id: string;
  title: string;
  publishTime: string;
  region: string;
  industry: string;
  enterprise: string;
  budget: string;
  deadline: string;
  source: string;
  status: 'active' | 'expired';
}

interface SourceConfig {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  updateFrequency: string;
}

const TenderAnnouncements: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    publishTime: '',
    region: '',
    industry: '',
    enterprise: ''
  });

  const [announcements] = useState<TenderAnnouncement[]>([
    {
      id: '1',
      title: '某医院医疗设备采购项目',
      publishTime: '2024-03-15',
      region: '北京市',
      industry: '医疗健康',
      enterprise: '北京某医院',
      budget: '500万元',
      deadline: '2024-04-15',
      source: '中国政府采购网',
      status: 'active'
    },
    {
      id: '2',
      title: '智慧城市建设项目招标',
      publishTime: '2024-03-14',
      region: '上海市',
      industry: '信息技术',
      enterprise: '上海城建集团',
      budget: '2000万元',
      deadline: '2024-04-20',
      source: '上海政府采购网',
      status: 'active'
    }
  ]);

  const [sources] = useState<SourceConfig[]>([
    {
      id: '1',
      name: '中国政府采购网',
      url: 'http://www.ccgp.gov.cn',
      enabled: true,
      updateFrequency: '每小时'
    },
    {
      id: '2',
      name: '中国招标投标公共服务平台',
      url: 'http://cebpubservice.com',
      enabled: true,
      updateFrequency: '每2小时'
    }
  ]);

  const handleSearch = () => {
    console.log('搜索招标公告', searchFilters);
  };

  const handleViewTender = (tender: TenderAnnouncement) => {
    console.log('查看招标详情', tender);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">招标公告</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                来源设置
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>信息来源设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>来源名称</TableHead>
                      <TableHead>网址</TableHead>
                      <TableHead>更新频率</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell className="text-blue-600">{source.url}</TableCell>
                        <TableCell>{source.updateFrequency}</TableCell>
                        <TableCell>
                          <Switch checked={source.enabled} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">添加来源</Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">保存设置</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索筛选区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              搜索筛选
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="keyword">关键词</Label>
                <Input
                  id="keyword"
                  placeholder="输入招标项目关键词"
                  value={searchFilters.keyword}
                  onChange={(e) => setSearchFilters({...searchFilters, keyword: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="publish-time">发布时间</Label>
                <Select value={searchFilters.publishTime} onValueChange={(value) => setSearchFilters({...searchFilters, publishTime: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择发布时间" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="week">最近一周</SelectItem>
                    <SelectItem value="month">最近一个月</SelectItem>
                    <SelectItem value="quarter">最近三个月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">地区</Label>
                <Select value={searchFilters.region} onValueChange={(value) => setSearchFilters({...searchFilters, region: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择地区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beijing">北京市</SelectItem>
                    <SelectItem value="shanghai">上海市</SelectItem>
                    <SelectItem value="guangzhou">广州市</SelectItem>
                    <SelectItem value="shenzhen">深圳市</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">行业</Label>
                <Select value={searchFilters.industry} onValueChange={(value) => setSearchFilters({...searchFilters, industry: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择行业" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">医疗健康</SelectItem>
                    <SelectItem value="it">信息技术</SelectItem>
                    <SelectItem value="construction">建筑工程</SelectItem>
                    <SelectItem value="education">教育培训</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="enterprise">企业</Label>
                <Input
                  id="enterprise"
                  placeholder="输入企业名称"
                  value={searchFilters.enterprise}
                  onChange={(e) => setSearchFilters({...searchFilters, enterprise: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
              <Search className="w-4 h-4 mr-2" />
              搜索
            </Button>
          </CardContent>
        </Card>

        {/* 招标公告列表 */}
        <Card>
          <CardHeader>
            <CardTitle>招标公告列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-purple-600 cursor-pointer">
                      {announcement.title}
                    </h3>
                    <Badge variant={announcement.status === 'active' ? 'default' : 'secondary'}>
                      {announcement.status === 'active' ? '进行中' : '已截止'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      发布时间：{announcement.publishTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      地区：{announcement.region}
                    </div>
                    <div className="flex items-center">
                      <Factory className="w-4 h-4 mr-1" />
                      行业：{announcement.industry}
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      企业：{announcement.enterprise}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>预算：{announcement.budget}</span>
                      <span>截止时间：{announcement.deadline}</span>
                      <span>来源：{announcement.source}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewTender(announcement)}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenderAnnouncements;
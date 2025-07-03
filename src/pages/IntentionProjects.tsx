import React, { useState } from 'react';
import { Filter, Search, Star, Building2, DollarSign, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface IntentionCondition {
  industries: string[];
  enterprises: string[];
  categories: string[];
  budgetRange: {
    min: string;
    max: string;
  };
  qualifications: string[];
}

interface IntentionProject {
  id: string;
  title: string;
  industry: string;
  enterprise: string;
  category: string;
  budget: string;
  qualifications: string[];
  publishTime: string;
  deadline: string;
  matchScore: number;
  region: string;
}

const IntentionProjects: React.FC = () => {
  const [conditions, setConditions] = useState<IntentionCondition>({
    industries: [],
    enterprises: [],
    categories: [],
    budgetRange: { min: '', max: '' },
    qualifications: []
  });

  const [projects] = useState<IntentionProject[]>([
    {
      id: '1',
      title: '智慧医院信息化建设项目',
      industry: '医疗健康',
      enterprise: '北京协和医院',
      category: '信息化建设',
      budget: '800万元',
      qualifications: ['软件开发资质', '医疗器械许可', 'ISO27001认证'],
      publishTime: '2024-03-15',
      deadline: '2024-04-20',
      matchScore: 95,
      region: '北京市'
    },
    {
      id: '2',
      title: '教育云平台开发项目',
      industry: '教育培训',
      enterprise: '北京市教育局',
      category: '软件开发',
      budget: '1200万元',
      qualifications: ['软件开发资质', '教育行业经验', '云计算认证'],
      publishTime: '2024-03-14',
      deadline: '2024-04-25',
      matchScore: 88,
      region: '北京市'
    },
    {
      id: '3',
      title: '城市交通管理系统升级',
      industry: '智慧城市',
      enterprise: '上海交通委',
      category: '系统集成',
      budget: '2000万元',
      qualifications: ['系统集成资质', '交通行业经验', '项目管理认证'],
      publishTime: '2024-03-13',
      deadline: '2024-04-30',
      matchScore: 82,
      region: '上海市'
    }
  ]);

  const handleConditionChange = (field: keyof IntentionCondition, value: any) => {
    setConditions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelectChange = (field: keyof IntentionCondition, value: string, checked: boolean) => {
    const currentValues = conditions[field] as string[];
    if (checked) {
      handleConditionChange(field, [...currentValues, value]);
    } else {
      handleConditionChange(field, currentValues.filter(v => v !== value));
    }
  };

  const handleSearch = () => {
    console.log('搜索意向项目', conditions);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const industryOptions = ['医疗健康', '教育培训', '智慧城市', '信息技术', '建筑工程', '制造业'];
  const categoryOptions = ['信息化建设', '软件开发', '系统集成', '硬件采购', '工程建设', '咨询服务'];
  const qualificationOptions = ['软件开发资质', '系统集成资质', 'ISO27001认证', '医疗器械许可', '建筑施工资质', '安全生产许可'];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">意向项目</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Star className="w-4 h-4 mr-2" />
            保存筛选条件
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 筛选条件设置 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                意向条件设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 行业选择 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">行业</Label>
                <div className="space-y-2">
                  {industryOptions.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry}`}
                        checked={conditions.industries.includes(industry)}
                        onCheckedChange={(checked) => 
                          handleMultiSelectChange('industries', industry, checked as boolean)
                        }
                      />
                      <Label htmlFor={`industry-${industry}`} className="text-sm">
                        {industry}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 企业类型 */}
              <div>
                <Label htmlFor="enterprise">企业类型</Label>
                <Input
                  id="enterprise"
                  placeholder="输入企业名称或类型"
                  onChange={(e) => handleConditionChange('enterprises', [e.target.value])}
                />
              </div>

              {/* 项目类别 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">项目类别</Label>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={conditions.categories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleMultiSelectChange('categories', category, checked as boolean)
                        }
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 项目预算 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">项目预算（万元）</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="最小值"
                    value={conditions.budgetRange.min}
                    onChange={(e) => handleConditionChange('budgetRange', {
                      ...conditions.budgetRange,
                      min: e.target.value
                    })}
                  />
                  <span className="flex items-center">至</span>
                  <Input
                    placeholder="最大值"
                    value={conditions.budgetRange.max}
                    onChange={(e) => handleConditionChange('budgetRange', {
                      ...conditions.budgetRange,
                      max: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* 所需资质 */}
              <div>
                <Label className="text-sm font-medium mb-3 block">所需资质</Label>
                <div className="space-y-2">
                  {qualificationOptions.map((qualification) => (
                    <div key={qualification} className="flex items-center space-x-2">
                      <Checkbox
                        id={`qualification-${qualification}`}
                        checked={conditions.qualifications.includes(qualification)}
                        onCheckedChange={(checked) => 
                          handleMultiSelectChange('qualifications', qualification, checked as boolean)
                        }
                      />
                      <Label htmlFor={`qualification-${qualification}`} className="text-sm">
                        {qualification}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSearch} className="w-full bg-purple-600 hover:bg-purple-700">
                <Search className="w-4 h-4 mr-2" />
                搜索项目
              </Button>
            </CardContent>
          </Card>

          {/* 项目列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>匹配项目列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900 hover:text-purple-600 cursor-pointer">
                          {project.title}
                        </h3>
                        <Badge className={`px-2 py-1 ${getMatchScoreColor(project.matchScore)}`}>
                          匹配度 {project.matchScore}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          {project.enterprise}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {project.category}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {project.budget}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-gray-600 mr-2">所需资质：</span>
                        <div className="flex flex-wrap gap-1">
                          {project.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            截止：{project.deadline}
                          </span>
                          <span>地区：{project.region}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            查看详情
                          </Button>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            关注项目
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
      </div>
    </div>
  );
};

export default IntentionProjects;
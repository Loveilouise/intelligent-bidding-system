import React, { useState } from 'react';
import { Bot, TrendingUp, Award, FileText, Calendar, DollarSign, Star, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecommendedProject {
  id: string;
  title: string;
  enterprise: string;
  industry: string;
  budget: string;
  deadline: string;
  winRate: number;
  recommendScore: number;
  reasons: string[];
  similarProjects: number;
  competitorCount: number;
  qualificationMatch: number;
  region: string;
  publishTime: string;
}

interface CompanyQualification {
  name: string;
  level: string;
  expireDate: string;
  status: 'valid' | 'expired' | 'expiring';
}

const AIRecommendations: React.FC = () => {
  const [recommendations] = useState<RecommendedProject[]>([
    {
      id: '1',
      title: '智慧医院数字化改造项目',
      enterprise: '北京朝阳医院',
      industry: '医疗健康',
      budget: '1500万元',
      deadline: '2024-04-25',
      winRate: 78,
      recommendScore: 92,
      reasons: [
        '企业具备相关医疗行业资质',
        '过去3年在医疗项目中标率较高',
        '项目规模与公司承接能力匹配',
        '竞争对手较少，中标概率高'
      ],
      similarProjects: 8,
      competitorCount: 5,
      qualificationMatch: 95,
      region: '北京市',
      publishTime: '2024-03-15'
    },
    {
      id: '2',
      title: '教育信息化平台建设',
      enterprise: '江苏省教育厅',
      industry: '教育培训',
      budget: '2000万元',
      deadline: '2024-05-10',
      winRate: 65,
      recommendScore: 85,
      reasons: [
        '公司在教育行业有丰富经验',
        '技术方案与项目需求高度吻合',
        '预算范围符合公司承接标准',
        '地域优势明显'
      ],
      similarProjects: 12,
      competitorCount: 8,
      qualificationMatch: 88,
      region: '江苏省',
      publishTime: '2024-03-14'
    },
    {
      id: '3',
      title: '智慧城市综合管理平台',
      enterprise: '深圳市政府',
      industry: '智慧城市',
      budget: '3000万元',
      deadline: '2024-05-20',
      winRate: 45,
      recommendScore: 72,
      reasons: [
        '项目预算充足，利润空间大',
        '符合公司战略发展方向',
        '可提升公司品牌影响力',
        '有助于拓展智慧城市业务'
      ],
      similarProjects: 3,
      competitorCount: 15,
      qualificationMatch: 75,
      region: '广东省',
      publishTime: '2024-03-13'
    }
  ]);

  const [qualifications] = useState<CompanyQualification[]>([
    {
      name: '软件开发资质',
      level: '甲级',
      expireDate: '2025-06-30',
      status: 'valid'
    },
    {
      name: '系统集成资质',
      level: '一级',
      expireDate: '2024-12-31',
      status: 'expiring'
    },
    {
      name: 'ISO27001认证',
      level: '国际标准',
      expireDate: '2025-03-15',
      status: 'valid'
    }
  ]);

  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getQualificationStatus = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">有效</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">即将到期</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">已过期</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-purple-600" />
            AI推荐
          </h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Target className="w-4 h-4 mr-2" />
            更新推荐
          </Button>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">项目推荐</TabsTrigger>
            <TabsTrigger value="analysis">分析报告</TabsTrigger>
            <TabsTrigger value="qualifications">资质状态</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* 推荐统计 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">今日推荐</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">平均中标率</p>
                      <p className="text-2xl font-bold text-gray-900">68%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">本月中标</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">推荐准确率</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 推荐项目列表 */}
            <div className="space-y-4">
              {recommendations.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {project.enterprise}
                          </span>
                          <span>{project.industry}</span>
                          <span>{project.region}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getRecommendScoreColor(project.recommendScore)}>
                          推荐度 {project.recommendScore}分
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">预计中标率</span>
                          <span className={`text-sm font-medium ${getWinRateColor(project.winRate)}`}>
                            {project.winRate}%
                          </span>
                        </div>
                        <Progress value={project.winRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">资质匹配度</span>
                          <span className="text-sm font-medium text-blue-600">
                            {project.qualificationMatch}%
                          </span>
                        </div>
                        <Progress value={project.qualificationMatch} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">项目预算</p>
                          <p className="text-lg font-semibold text-gray-900">{project.budget}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">竞争对手</p>
                          <p className="text-lg font-semibold text-gray-900">{project.competitorCount}家</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">推荐理由：</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          截止：{project.deadline}
                        </span>
                        <span>类似项目：{project.similarProjects}个</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          申请投标
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>投标分析报告</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">行业投标统计</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">医疗健康</p>
                        <p className="text-2xl font-bold text-green-600">85%</p>
                        <p className="text-xs text-gray-500">中标率</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">教育培训</p>
                        <p className="text-2xl font-bold text-yellow-600">72%</p>
                        <p className="text-xs text-gray-500">中标率</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600">智慧城市</p>
                        <p className="text-2xl font-bold text-blue-600">58%</p>
                        <p className="text-xs text-gray-500">中标率</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">投标建议</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">优势领域</p>
                        <p className="text-sm text-blue-700">医疗健康领域表现突出，建议重点关注相关项目</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="font-medium text-yellow-900">改进建议</p>
                        <p className="text-sm text-yellow-700">智慧城市项目竞争激烈，建议提升技术方案差异化</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications">
            <Card>
              <CardHeader>
                <CardTitle>企业资质状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{qual.name}</p>
                        <p className="text-sm text-gray-600">{qual.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">到期时间：{qual.expireDate}</p>
                        {getQualificationStatus(qual.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIRecommendations;
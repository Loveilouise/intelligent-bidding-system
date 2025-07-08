
import React, { useState } from 'react';
import { Plus, Settings, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: 'personal' | 'enterprise' | 'industry';
  status: 'active' | 'inactive';
  createdAt: string;
  documentsCount: number;
}

const KnowledgeSettings: React.FC = () => {
  const [knowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: '1',
      name: '企业标准知识库',
      description: '包含企业标准文档和规范',
      type: 'enterprise',
      status: 'active',
      createdAt: '2024-01-15',
      documentsCount: 156
    },
    {
      id: '2',
      name: '个人学习笔记',
      description: '个人学习资料整理',
      type: 'personal',
      status: 'active',
      createdAt: '2024-02-20',
      documentsCount: 89
    }
  ]);

  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null);
  const [basicSettings, setBasicSettings] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [advancedSettings, setAdvancedSettings] = useState({
    qaMode: 'auto',
    minRecallValue: 0.7,
    maxAgentRounds: 5,
    enableAutoUpdate: true
  });

  const handleCreateKB = () => {
    console.log('创建新知识库');
  };

  const handleEditKB = (kb: KnowledgeBase) => {
    setSelectedKB(kb);
    setBasicSettings({
      name: kb.name,
      description: kb.description,
      isPublic: kb.type !== 'personal'
    });
  };

  const handleSaveSettings = () => {
    console.log('保存设置');
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">知识库设置</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700">
                <Plus className="w-4 h-4 mr-2" />
                创建知识库
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>创建新知识库</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kb-name">知识库名称</Label>
                  <Input
                    id="kb-name"
                    placeholder="请输入知识库名称"
                    value={basicSettings.name}
                    onChange={(e) => setBasicSettings({...basicSettings, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="kb-desc">描述</Label>
                  <Textarea
                    id="kb-desc"
                    placeholder="请输入知识库描述"
                    value={basicSettings.description}
                    onChange={(e) => setBasicSettings({...basicSettings, description: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="kb-public"
                    checked={basicSettings.isPublic}
                    onCheckedChange={(checked) => setBasicSettings({...basicSettings, isPublic: checked})}
                  />
                  <Label htmlFor="kb-public">公开知识库</Label>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">取消</Button>
                  <Button onClick={handleCreateKB} className="flex-1 bg-sky-600 hover:bg-sky-700">创建</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 知识库列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>知识库列表</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名称</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>文档数量</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {knowledgeBases.map((kb) => (
                      <TableRow key={kb.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{kb.name}</div>
                            <div className="text-sm text-gray-500">{kb.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={kb.type === 'enterprise' ? 'default' : 'secondary'}>
                            {kb.type === 'enterprise' ? '企业' : kb.type === 'personal' ? '个人' : '行业'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={kb.status === 'active' ? 'default' : 'secondary'}>
                            {kb.status === 'active' ? '启用' : '停用'}
                          </Badge>
                        </TableCell>
                        <TableCell>{kb.documentsCount}</TableCell>
                        <TableCell>{kb.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditKB(kb)}
                            >
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
          </div>

          {/* 设置面板 */}
          <div className="space-y-6">
            {/* 基础设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-sky-600" />
                  基础设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">知识库名称</Label>
                  <Input
                    id="name"
                    value={basicSettings.name}
                    onChange={(e) => setBasicSettings({...basicSettings, name: e.target.value})}
                    placeholder="请输入知识库名称"
                  />
                </div>
                <div>
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={basicSettings.description}
                    onChange={(e) => setBasicSettings({...basicSettings, description: e.target.value})}
                    placeholder="请输入知识库描述"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={basicSettings.isPublic}
                    onCheckedChange={(checked) => setBasicSettings({...basicSettings, isPublic: checked})}
                  />
                  <Label htmlFor="public">公开知识库</Label>
                </div>
              </CardContent>
            </Card>

            {/* 高级设置 */}
            <Card>
              <CardHeader>
                <CardTitle>高级设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="qa-mode">问答方式</Label>
                  <Select value={advancedSettings.qaMode} onValueChange={(value) => setAdvancedSettings({...advancedSettings, qaMode: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">自动问答</SelectItem>
                      <SelectItem value="manual">手动问答</SelectItem>
                      <SelectItem value="hybrid">混合模式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recall-value">召回最小值</Label>
                  <Input
                    id="recall-value"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={advancedSettings.minRecallValue}
                    onChange={(e) => setAdvancedSettings({...advancedSettings, minRecallValue: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="agent-rounds">Agent最多执行轮次</Label>
                  <Input
                    id="agent-rounds"
                    type="number"
                    min="1"
                    max="10"
                    value={advancedSettings.maxAgentRounds}
                    onChange={(e) => setAdvancedSettings({...advancedSettings, maxAgentRounds: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-update"
                    checked={advancedSettings.enableAutoUpdate}
                    onCheckedChange={(checked) => setAdvancedSettings({...advancedSettings, enableAutoUpdate: checked})}
                  />
                  <Label htmlFor="auto-update">启用自动更新</Label>
                </div>
                <Button onClick={handleSaveSettings} className="w-full bg-sky-600 hover:bg-sky-700">
                  保存设置
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSettings;

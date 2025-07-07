import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AddMemberDialog from './AddMemberDialog';
import { useToast } from '@/hooks/use-toast';

interface Member {
  id: string;
  username: string;
  phone: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'member' | 'viewer';
  lastActivity: string;
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      username: '李雯雯',
      phone: '138****8888',
      status: 'active',
      role: 'admin',
      lastActivity: '2024-01-15 14:30'
    },
    {
      id: '2',
      username: '张明',
      phone: '139****9999',
      status: 'active',
      role: 'member',
      lastActivity: '2024-01-15 10:20'
    },
    {
      id: '3',
      username: '王小华',
      phone: '137****7777',
      status: 'inactive',
      role: 'viewer',
      lastActivity: '2024-01-10 16:45'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    username: '',
    phone: ''
  });
  const { toast } = useToast();

  const filteredMembers = members.filter(member => {
    return (
      (!filters.status || member.status === filters.status) &&
      (!filters.role || member.role === filters.role) &&
      (!filters.username || member.username.includes(filters.username)) &&
      (!filters.phone || member.phone.includes(filters.phone))
    );
  });

  const handleRemoveMember = (memberId: string, memberName: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    toast({
      title: "成员移除成功",
      description: `${memberName} 已从工作空间移除`,
    });
  };

  const handleAddMember = (phone: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      username: '新成员',
      phone: phone,
      status: 'inactive',
      role: 'member',
      lastActivity: '-'
    };
    setMembers([...members, newMember]);
    toast({
      title: "成员添加成功",
      description: `已向 ${phone} 发送邀请`,
    });
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? '已激活' : '未激活'}
      </Badge>
    );
  };

  const getRoleBadge = (role: 'admin' | 'member' | 'viewer') => {
    const roleMap = {
      admin: '管理员',
      member: '成员',
      viewer: '查看者'
    };
    return <Badge variant="outline">{roleMap[role]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>成员管理</CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增成员
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* 筛选条件 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="账号状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部状态</SelectItem>
                <SelectItem value="active">已激活</SelectItem>
                <SelectItem value="inactive">未激活</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({ ...filters, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="成员角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="member">成员</SelectItem>
                <SelectItem value="viewer">查看者</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索用户名"
                value={filters.username}
                onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索手机号"
                value={filters.phone}
                onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          {/* 成员列表 */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>账号状态</TableHead>
                <TableHead>成员角色</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>最后操作时间</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.username}</TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.lastActivity}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-1" />
                          移除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认移除成员？</AlertDialogTitle>
                          <AlertDialogDescription>
                            您确定要将 {member.username} 从工作空间中移除吗？此操作不可撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.id, member.username)}
                          >
                            确认移除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              暂无符合条件的成员
            </div>
          )}
        </CardContent>
      </Card>

      <AddMemberDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddMember={handleAddMember}
      />
    </div>
  );
};

export default MemberManagement;
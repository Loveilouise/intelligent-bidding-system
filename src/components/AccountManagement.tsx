import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Edit2, LogOut, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const AccountManagement: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    username: '李雯雯',
    account: 'liwenwen2024',
    phone: '138****8888',
    email: 'liwenwen@gmail.com'
  });
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false
  });
  const [editValues, setEditValues] = useState(userInfo);
  const { toast } = useToast();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo({ ...userInfo, avatar: e.target?.result as string });
        toast({
          title: "头像更新成功",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (field: 'username' | 'email') => {
    if (isEditing[field]) {
      // 保存
      setUserInfo({ ...userInfo, [field]: editValues[field] });
      setIsEditing({ ...isEditing, [field]: false });
      toast({
        title: `${field === 'username' ? '用户名' : '邮箱'}更新成功`,
      });
    } else {
      // 开始编辑
      setIsEditing({ ...isEditing, [field]: true });
    }
  };

  const handleLogout = () => {
    toast({
      title: "已退出登录",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "账号注销成功",
      description: "您的账号已被注销",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">账号管理</h1>
        <p className="text-muted-foreground">管理您的个人账号信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像 */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userInfo.avatar} />
              <AvatarFallback className="text-lg">
                {userInfo.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label className="block text-sm font-medium mb-2">头像</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  更换头像
                </Button>
              </div>
            </div>
          </div>

          {/* 用户名 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <div className="flex space-x-2">
                <Input
                  value={isEditing.username ? editValues.username : userInfo.username}
                  onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
                  disabled={!isEditing.username}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit('username')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>账号</Label>
              <Input value={userInfo.account} disabled />
            </div>
          </div>

          {/* 联系方式 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>手机号</Label>
              <Input value={userInfo.phone} disabled />
            </div>

            <div className="space-y-2">
              <Label>邮箱</Label>
              <div className="flex space-x-2">
                <Input
                  value={isEditing.email ? editValues.email : userInfo.email}
                  onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                  disabled={!isEditing.email}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit('email')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账号操作 */}
      <Card>
        <CardHeader>
          <CardTitle>账号操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认退出登录？</AlertDialogTitle>
                  <AlertDialogDescription>
                    退出登录后需要重新输入账号密码才能登录。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    确认退出
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="w-4 h-4 mr-2" />
                  注销账号
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认注销账号？</AlertDialogTitle>
                  <AlertDialogDescription>
                    注销账号后，您的所有数据将被永久删除，且无法恢复。此操作不可逆转。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    确认注销
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManagement;
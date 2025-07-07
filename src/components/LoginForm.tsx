
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);

  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录延迟
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 1000);
  };

  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟短信登录延迟
    setTimeout(() => {
      onLogin(phone, smsCode);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendSms = async () => {
    if (!phone) return;
    
    setIsSendingSms(true);
    // 模拟发送短信验证码
    setTimeout(() => {
      setIsSendingSms(false);
      console.log('验证码已发送到:', phone);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            智能标书系统
          </CardTitle>
          <p className="text-gray-600 mt-2">请选择登录方式</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">账号登录</TabsTrigger>
              <TabsTrigger value="sms">短信登录</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <form onSubmit={handleAccountLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="sms">
              <form onSubmit={handleSmsLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsCode">验证码</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="smsCode"
                      type="text"
                      placeholder="请输入验证码"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendSms}
                      disabled={isSendingSms || !phone}
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                    >
                      {isSendingSms ? '发送中...' : '获取验证码'}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

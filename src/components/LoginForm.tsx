
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <Card className="w-full max-w-md relative backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl shadow-primary/10">
        {/* Tech decoration */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-lg"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-lg"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-lg"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-lg"></div>
        
        <CardHeader className="text-center relative">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <div className="w-8 h-8 bg-foreground/20 rounded-lg"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            智能标书系统
          </CardTitle>
          <p className="text-muted-foreground mt-2 text-sm">AI-Powered Bid Generation Platform</p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"></div>
        </CardHeader>
        <CardContent className="relative">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-primary/20">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                账号登录
              </TabsTrigger>
              <TabsTrigger 
                value="sms"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
              >
                短信登录
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="mt-6">
              <form onSubmit={handleAccountLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground/90 font-medium">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/90 font-medium">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      登录中...
                    </span>
                  ) : '登录'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="sms" className="mt-6">
              <form onSubmit={handleSmsLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground/90 font-medium">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-muted/30 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsCode" className="text-foreground/90 font-medium">验证码</Label>
                  <div className="flex space-x-3">
                    <Input
                      id="smsCode"
                      type="text"
                      placeholder="请输入验证码"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      required
                      className="flex-1 bg-muted/30 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendSms}
                      disabled={isSendingSms || !phone}
                      className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 whitespace-nowrap"
                    >
                      {isSendingSms ? '发送中...' : '获取验证码'}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      登录中...
                    </span>
                  ) : '登录'}
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

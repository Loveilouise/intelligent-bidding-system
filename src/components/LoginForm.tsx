
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);

  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟短信登录延迟
    setTimeout(() => {
      onLogin(phone, smsCode);
      setIsLoading(false);
    }, 1000);
  };

  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 模拟登录延迟
    setTimeout(() => {
      onLogin(username, password);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-sky-500/10 to-sky-600/10"></div>
      <Card className="w-full max-w-4xl relative z-10 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/66bc4a96-4c4e-4093-a308-07b2fcdda06d.png" 
                alt="智能标书系统" 
                className="w-10 h-10"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent">
            智能标书系统
          </CardTitle>
          <p className="text-gray-600 mt-3 text-base">欢迎使用智能标书管理平台</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左侧 - 短信登录 */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">短信登录</h3>
                <p className="text-gray-600 text-sm">使用手机号码快速登录</p>
              </div>
              <form onSubmit={handleSmsLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">手机号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsCode" className="text-gray-700 font-medium">验证码</Label>
                  <div className="flex space-x-3">
                    <Input
                      id="smsCode"
                      type="text"
                      placeholder="请输入验证码"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      required
                      className="flex-1 h-12 border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendSms}
                      disabled={isSendingSms || !phone}
                      className="h-12 px-4 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                    >
                      {isSendingSms ? '发送中...' : '获取验证码'}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </div>

            {/* 中间分隔线 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-px h-64 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* 右侧 - 密码登录 */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">密码登录</h3>
                <p className="text-gray-600 text-sm">使用账号密码登录</p>
              </div>
              <form onSubmit={handleAccountLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

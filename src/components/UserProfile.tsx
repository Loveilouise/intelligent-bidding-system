import React, { useState } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WorkspaceSelector from './WorkspaceSelector';

interface UserProfileProps {
  onLogout: () => void;
  onPersonalCenter: () => void;
  onWorkspaceManagement: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout, onPersonalCenter, onWorkspaceManagement }) => {
  const [user] = useState({
    name: '李雯雯',
    email: 'liwenwen@gmail.com'
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div 
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-accent/50 rounded-md transition-colors"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onPersonalCenter} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          个人中心
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onWorkspaceManagement} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          切换工作空间
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive hover:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;

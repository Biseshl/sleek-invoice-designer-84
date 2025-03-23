
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { UserIcon, LogIn, LogOut } from 'lucide-react';

const HeaderButtons = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="gap-2 hidden md:flex"
          onClick={handleDashboard}
        >
          <UserIcon className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        className="gap-2 hidden md:flex"
        onClick={() => navigate('/register')}
      >
        <UserIcon className="h-4 w-4" />
        <span>Register</span>
      </Button>
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={() => navigate('/login')}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden md:inline">Login</span>
      </Button>
    </div>
  );
};

export default HeaderButtons;

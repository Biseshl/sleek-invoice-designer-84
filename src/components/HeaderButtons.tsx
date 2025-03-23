
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { UserIcon, LogIn, LogOut, LayoutDashboard, ChevronLeft } from 'lucide-react';

const HeaderButtons = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const showBackToDashboard = user && 
    location.pathname !== '/dashboard' && 
    location.pathname !== '/';

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {showBackToDashboard && (
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={handleDashboard}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline">Back to Dashboard</span>
            <span className="md:hidden">Back</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className="gap-2 hidden md:flex"
          onClick={handleDashboard}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
        
        <Button 
          variant="destructive" 
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

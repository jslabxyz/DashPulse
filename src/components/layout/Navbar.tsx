
import React from 'react';
import { Search, Bell, User, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("bg-white border-b border-gray-200 sticky top-0 z-30", className)}>
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-orange-500" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">DashPulse</h1>
          </div>
          
          <div className="relative hidden md:flex items-center h-10 rounded-lg px-3 text-gray-500 focus-within:text-gray-700 bg-gray-50 border">
            <Search className="h-4 w-4 mr-2" />
            <Input 
              type="search" 
              placeholder="Search ASINs, keywords, campaigns..." 
              className="h-10 w-[280px] lg:w-[320px] bg-transparent border-none px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-gray-400"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          </Button>
          
          <Avatar className="h-10 w-10 transition-transform duration-200 hover:scale-105 border-2 border-gray-200">
            <AvatarFallback className="bg-orange-50 text-orange-600 font-semibold">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

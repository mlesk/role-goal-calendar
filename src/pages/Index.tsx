
import React from 'react';
import { AppProvider } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const Index = () => {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col bg-background">
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold">Role-Goal-Task Manager</h1>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25} minSize={20}>
              <Sidebar />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={75}>
              <Calendar />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </AppProvider>
  );
};

export default Index;

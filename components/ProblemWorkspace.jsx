'use client';
import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import ProblemDescription from './ProblemDescription';
import ProblemEditor from './ProblemEditor';

const ProblemWorkspace = ({ problem }) => {
    return (
        <div className='h-[calc(100vh-4rem)] w-full'>
            <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                <ResizablePanel defaultSize={40} minSize={30}>
                    <ProblemDescription problem={problem} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60} minSize={30}>
                    <ProblemEditor problem={problem} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default ProblemWorkspace;

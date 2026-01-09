'use client';
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';

const ProblemDescription = ({ problem }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'text-green-500 bg-green-500/10 hover:bg-green-500/20';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20';
            case 'HARD': return 'text-red-500 bg-red-500/10 hover:bg-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <Tabs defaultValue="description" className="flex-1 flex flex-col h-full">
                <div className="px-4 pt-2">
                    <TabsList className="w-full justify-start bg-transparent h-10 p-0 rounded-none border-b">
                        <TabsTrigger
                            value="description"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="editorial"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Editorial
                        </TabsTrigger>
                        <TabsTrigger
                            value="solutions"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Solutions
                        </TabsTrigger>
                        <TabsTrigger
                            value="submissions"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Submissions
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="description" className="p-4 m-0 space-y-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">{problem.title}</h1>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)} border-none`}>
                                    {problem.difficulty}
                                </Badge>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>1.2K</span>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <ThumbsDown className="h-4 w-4" />
                                        <span>45</span>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-sm leading-relaxed space-y-4">
                            <p>{problem.description}</p>
                        </div>

                        {/* Examples */}
                        {problem.examples && Object.keys(problem.examples).length > 0 && (
                            <div className="space-y-4">
                                {Object.entries(problem.examples).map(([lang, example], index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="font-semibold text-sm">Example {index + 1}:</h3>
                                        <div className="bg-muted p-3 rounded-md text-sm font-mono space-y-1">
                                            <div><span className="font-semibold text-muted-foreground">Input:</span> {example.input}</div>
                                            <div><span className="font-semibold text-muted-foreground">Output:</span> {example.output}</div>
                                            {example.explanation && (
                                                <div><span className="font-semibold text-muted-foreground">Explanation:</span>
                                                    <div className="whitespace-pre-wrap">{example.explanation}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Constraints */}
                        {problem.constraints && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Constraints:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {problem.constraints.split('\n').map((constraint, i) => (
                                        <li key={i}>{constraint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="h-10"></div>
                    </TabsContent>

                    <TabsContent value="editorial" className="p-4 m-0">
                        <div className="prose dark:prose-invert max-w-none">
                            <h3>Editorial</h3>
                            <p className="whitespace-pre-wrap">{problem.editorial || "No editorial available."}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="solutions" className="p-4 m-0">
                        <p className="text-muted-foreground">Solutions tab functionality coming soon.</p>
                    </TabsContent>

                    <TabsContent value="submissions" className="p-4 m-0">
                        <p className="text-muted-foreground">Submissions tab functionality coming soon.</p>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
};

export default ProblemDescription;

import React from 'react'
import { getUserPlaylists } from '@/app/action/serverActions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListMusic, Plus, Clock, ExternalLink, Library } from "lucide-react"
import Link from 'next/link'

const PlaylistsPage = async () => {
    const playlists = await getUserPlaylists();

    return (
        <div className="container max-w-6xl py-10 px-4 space-y-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Library className="h-8 w-8 text-primary" />
                        My Playlists
                    </h1>
                    <p className="text-muted-foreground">
                        Your custom collections of problems to conquer.
                    </p>
                </div>
                <Link href="/problems">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Browse Problems
                    </Button>
                </Link>
            </div>

            {playlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-xl space-y-4">
                    <div className="bg-muted p-4 rounded-full">
                        <ListMusic className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-xl font-semibold">No playlists yet</h3>
                        <p className="text-muted-foreground">Start by selecting some problems from the problem list.</p>
                    </div>
                    <Link href="/problems">
                        <Button variant="outline">Get Started</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => (
                        <Card key={playlist.id} className="group hover:border-primary/50 transition-all hover:shadow-md flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary" className="font-mono">
                                        {playlist.problems.length} Problems
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(playlist.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                                    {playlist.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 h-10">
                                    {playlist.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-2 mt-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preview</p>
                                    <div className="space-y-1.5">
                                        {playlist.problems.slice(0, 3).map((problem) => (
                                            <div key={problem.id} className="flex items-center justify-between text-sm bg-muted/30 px-2 py-1.5 rounded-md border border-transparent group-hover:border-primary/10">
                                                <span className="truncate max-w-[140px]">{problem.title}</span>
                                                <Badge variant="outline" className="text-[10px] py-0 h-4 px-1 opacity-70">
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>
                                        ))}
                                        {playlist.problems.length > 3 && (
                                            <p className="text-xs text-center text-muted-foreground pt-1 italic">
                                                + {playlist.problems.length - 3} more problems
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2">
                                <Link href={`/playlists/${playlist.id}`} className="w-full">
                                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        View Playlist
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PlaylistsPage

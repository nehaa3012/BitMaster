"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlaylist } from "@/app/action/serverActions";
import { toast } from "sonner";
import { Loader2, ListMusic } from "lucide-react";

export function CreatePlaylistModal({ isOpen, onClose, selectedProblems, onClearSelection }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a playlist title");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createPlaylist(title, selectedProblems);
            if (result) {
                toast.success("Playlist created successfully!");
                setTitle("");
                setDescription("");
                onClearSelection();
                onClose();
            }
        } catch (error) {
            toast.error(error.message || "Failed to create playlist");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ListMusic className="h-5 w-5 text-primary" />
                        Create New Playlist
                    </DialogTitle>
                    <DialogDescription>
                        Group your selected {selectedProblems.length} problems into a custom collection.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Playlist Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Dynamic Programming Mastery"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this playlist about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="bg-muted/50 p-3 rounded-md border text-xs">
                        <p className="font-medium mb-1">Included Problems:</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                            {selectedProblems.slice(0, 3).map(p => (
                                <li key={p.id} className="truncate">{p.title}</li>
                            ))}
                            {selectedProblems.length > 3 && (
                                <li className="italic">+ {selectedProblems.length - 3} more</li>
                            )}
                        </ul>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Playlist"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

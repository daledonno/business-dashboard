import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, Link, Image, ListTodo } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface WorkspaceGridProps {
  business: {
    id: string;
    name: string;
    boards: Array<{
      id: string;
      title: string;
      description: string;
      type: "standard" | "image-gallery" | "quick-links";
      checklist: Array<{ id: string; text: string; checked: boolean }>;
      images?: string[];
      links?: Array<{ id: string; title: string; url: string }>;
      features?: {
        checklist?: boolean;
        images?: boolean;
        links?: boolean;
      };
    }>;
  };
  onUpdateBoard: (
    boardId: string,
    updates: {
      title?: string;
      description?: string;
      checklist?: Array<{ id: string; text: string; checked: boolean }>;
      images?: string[];
      links?: Array<{ id: string; title: string; url: string }>;
      features?: {
        checklist?: boolean;
        images?: boolean;
        links?: boolean;
      };
    }
  ) => void;
}

const WorkspaceGrid: React.FC<WorkspaceGridProps> = ({
  business,
  onUpdateBoard,
}) => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleAddChecklistItem = (boardId: string) => {
    if (!newChecklistItem.trim()) return;

    const board = business.boards.find((b) => b.id === boardId);
    if (!board) return;

    const newItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      checked: false,
    };

    onUpdateBoard(boardId, {
      checklist: [...board.checklist, newItem],
    });

    setNewChecklistItem("");
  };

  const handleAddLink = (boardId: string) => {
    if (!newLink.title.trim() || !newLink.url.trim()) return;

    const board = business.boards.find((b) => b.id === boardId);
    if (!board) return;

    const newLinkItem = {
      id: Date.now().toString(),
      ...newLink,
    };

    onUpdateBoard(boardId, {
      links: [...(board.links || []), newLinkItem],
    });

    setNewLink({ title: "", url: "" });
  };

  const handleImageUpload = async (boardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would typically upload the file to a storage service
    // For now, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    
    const board = business.boards.find((b) => b.id === boardId);
    if (!board) return;

    onUpdateBoard(boardId, {
      images: [...(board.images || []), imageUrl],
    });
  };

  const toggleFeature = (boardId: string, feature: 'checklist' | 'images' | 'links') => {
    const board = business.boards.find((b) => b.id === boardId);
    if (!board) return;

    onUpdateBoard(boardId, {
      features: {
        ...(board.features || {}),
        [feature]: !(board.features?.[feature])
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">{business.name}</h1>
      <div className="card-grid">
        {business.boards.map((board) => (
          <div
            key={board.id}
            className="business-card group"
            onClick={() => setSelectedBoard(board.id)}
          >
            <h3 className="text-lg font-medium mb-2">{board.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{board.description}</p>

            {board.features?.checklist && board.checklist.length > 0 && (
              <div className="checklist-preview">
                {board.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox checked={item.checked} />
                    <span className={item.checked ? "line-through text-gray-400" : ""}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {board.features?.images && board.images && board.images.length > 0 && (
              <div className="image-gallery">
                {board.images.map((image, index) => (
                  <img key={index} src={image} alt={`Gallery image ${index + 1}`} />
                ))}
              </div>
            )}

            {board.features?.links && board.links && board.links.length > 0 && (
              <div className="quick-links">
                {board.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog
        open={selectedBoard !== null}
        onOpenChange={(open) => !open && setSelectedBoard(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedBoard && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <Input
                    value={
                      business.boards.find((b) => b.id === selectedBoard)?.title
                    }
                    onChange={(e) =>
                      onUpdateBoard(selectedBoard, { title: e.target.value })
                    }
                    className="text-xl font-semibold"
                  />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={
                      business.boards.find((b) => b.id === selectedBoard)
                        ?.description
                    }
                    onChange={(e) =>
                      onUpdateBoard(selectedBoard, {
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Enable Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ListTodo className="w-4 h-4" />
                        <Label>Checklist</Label>
                      </div>
                      <Switch
                        checked={business.boards.find((b) => b.id === selectedBoard)?.features?.checklist}
                        onCheckedChange={(checked) => toggleFeature(selectedBoard, 'checklist')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image className="w-4 h-4" />
                        <Label>Images</Label>
                      </div>
                      <Switch
                        checked={business.boards.find((b) => b.id === selectedBoard)?.features?.images}
                        onCheckedChange={(checked) => toggleFeature(selectedBoard, 'images')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4" />
                        <Label>Quick Links</Label>
                      </div>
                      <Switch
                        checked={business.boards.find((b) => b.id === selectedBoard)?.features?.links}
                        onCheckedChange={(checked) => toggleFeature(selectedBoard, 'links')}
                      />
                    </div>
                  </div>
                </div>

                {business.boards.find((b) => b.id === selectedBoard)?.features?.checklist && (
                  <div>
                    <Label>Checklist</Label>
                    <div className="mt-2 space-y-2">
                      {business.boards
                        .find((b) => b.id === selectedBoard)
                        ?.checklist.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start space-x-2"
                          >
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={(checked) => {
                                const board = business.boards.find(
                                  (b) => b.id === selectedBoard
                                );
                                if (!board) return;

                                onUpdateBoard(selectedBoard, {
                                  checklist: board.checklist.map((i) =>
                                    i.id === item.id
                                      ? { ...i, checked: checked === true }
                                      : i
                                  ),
                                });
                              }}
                            />
                            <span
                              className={`flex-1 ${
                                item.checked ? "line-through text-gray-400" : ""
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      <div className="flex gap-2">
                        <Input
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          placeholder="Add new item"
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            handleAddChecklistItem(selectedBoard)
                          }
                        />
                        <Button
                          size="icon"
                          onClick={() => handleAddChecklistItem(selectedBoard)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {business.boards.find((b) => b.id === selectedBoard)?.features?.images && (
                  <div>
                    <Label>Images</Label>
                    <div className="mt-2 space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(selectedBoard, e)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {business.boards
                          .find((b) => b.id === selectedBoard)
                          ?.images?.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="rounded-md object-cover w-full h-32"
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {business.boards.find((b) => b.id === selectedBoard)?.features?.links && (
                  <div>
                    <Label>Quick Links</Label>
                    <div className="mt-2 space-y-4">
                      <div className="space-y-2">
                        <Input
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          placeholder="Link Title"
                        />
                        <Input
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                          placeholder="URL"
                        />
                        <Button
                          onClick={() => handleAddLink(selectedBoard)}
                          className="w-full"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Add Link
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {business.boards
                          .find((b) => b.id === selectedBoard)
                          ?.links?.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:underline"
                            >
                              {link.title}
                            </a>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceGrid;

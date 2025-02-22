
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
import { PlusCircle } from "lucide-react";

interface WorkspaceGridProps {
  business: {
    id: string;
    name: string;
    boards: Array<{
      id: string;
      title: string;
      description: string;
      checklist: Array<{ id: string; text: string; checked: boolean }>;
    }>;
  };
  onUpdateBoard: (
    boardId: string,
    updates: {
      title?: string;
      description?: string;
      checklist?: Array<{ id: string; text: string; checked: boolean }>;
    }
  ) => void;
}

const WorkspaceGrid: React.FC<WorkspaceGridProps> = ({
  business,
  onUpdateBoard,
}) => {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState("");

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
            <p className="text-gray-600 line-clamp-3">{board.description}</p>
            {board.checklist.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {board.checklist.filter((item) => item.checked).length} of{" "}
                  {board.checklist.length} tasks completed
                </p>
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
                  <label className="text-sm font-medium">Description</label>
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
                <div>
                  <label className="text-sm font-medium">Checklist</label>
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceGrid;

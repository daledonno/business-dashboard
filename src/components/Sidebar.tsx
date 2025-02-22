
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SidebarProps {
  businesses: Array<{ id: string; name: string }>;
  selectedBusiness: string | null;
  onSelectBusiness: (id: string) => void;
  onAddBusiness: (name: string) => void;
  onDeleteBusiness: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  businesses,
  selectedBusiness,
  onSelectBusiness,
  onAddBusiness,
  onDeleteBusiness,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [newBusinessName, setNewBusinessName] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleAddBusiness = () => {
    if (newBusinessName.trim()) {
      onAddBusiness(newBusinessName.trim());
      setNewBusinessName("");
      setShowDialog(false);
    }
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className={`font-semibold ${!isOpen && "hidden"}`}>Businesses</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-gray-100"
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="p-4">
        {isOpen && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowDialog(true)}
              >
                <PlusCircle className="h-4 w-4" />
                Add Business
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Business</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Business Name"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddBusiness()}
                />
                <Button onClick={handleAddBusiness}>Add Business</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <div className="mt-4 space-y-1">
          {businesses.map((business) => (
            <div
              key={business.id}
              className={`sidebar-item ${
                selectedBusiness === business.id ? "bg-primary" : ""
              }`}
              onClick={() => onSelectBusiness(business.id)}
            >
              {isOpen ? (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{business.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBusiness(business.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  {business.name[0]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

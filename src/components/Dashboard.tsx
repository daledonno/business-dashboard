
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import WorkspaceGrid from "./WorkspaceGrid";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  boards: Board[];
  order?: number;
}

interface Board {
  id: string;
  title: string;
  description: string;
  type: "standard" | "image-gallery" | "quick-links";
  checklist: { id: string; text: string; checked: boolean }[];
  images?: string[];
  links?: { id: string; title: string; url: string }[];
}

const defaultBoards: Board[] = [
  { 
    id: "1", 
    title: "Business Details", 
    description: "", 
    type: "standard" as const, 
    checklist: [] 
  },
  { 
    id: "2", 
    title: "Launch List", 
    description: "", 
    type: "standard" as const, 
    checklist: [] 
  },
  { 
    id: "3", 
    title: "Process", 
    description: "", 
    type: "standard" as const, 
    checklist: [] 
  },
  { 
    id: "4", 
    title: "Business Goals", 
    description: "", 
    type: "standard" as const, 
    checklist: [] 
  },
  { 
    id: "5", 
    title: "Marketing", 
    description: "", 
    type: "image-gallery" as const, 
    checklist: [], 
    images: [] 
  },
  { 
    id: "6", 
    title: "Quick Links", 
    description: "", 
    type: "quick-links" as const, 
    checklist: [], 
    links: [] 
  }
];

const Dashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem("businesses");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("businesses", JSON.stringify(businesses));
  }, [businesses]);

  const addBusiness = (name: string) => {
    const newBusiness: Business = {
      id: Date.now().toString(),
      name,
      boards: defaultBoards.map((board) => ({ ...board })),
      order: businesses.length,
    };
    setBusinesses([...businesses, newBusiness]);
    setSelectedBusiness(newBusiness.id);
    toast.success("Business added successfully");
  };

  const updateBoard = (businessId: string, boardId: string, updates: Partial<Board>) => {
    setBusinesses(businesses.map((business) => {
      if (business.id === businessId) {
        return {
          ...business,
          boards: business.boards.map((board) => 
            board.id === boardId ? { ...board, ...updates } : board
          ),
        };
      }
      return business;
    }));
    toast.success("Board updated successfully");
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
    if (selectedBusiness === id) {
      setSelectedBusiness(null);
    }
    toast.success("Business deleted successfully");
  };

  const handleReorderBusinesses = (reorderedBusinesses: Business[]) => {
    setBusinesses(reorderedBusinesses);
    localStorage.setItem("businesses", JSON.stringify(reorderedBusinesses));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        businesses={businesses}
        selectedBusiness={selectedBusiness}
        onSelectBusiness={setSelectedBusiness}
        onAddBusiness={addBusiness}
        onDeleteBusiness={deleteBusiness}
        onReorderBusinesses={handleReorderBusinesses}
      />
      <main className="flex-1 overflow-auto">
        {selectedBusiness && (
          <WorkspaceGrid
            business={businesses.find((b) => b.id === selectedBusiness)!}
            onUpdateBoard={(boardId, updates) => updateBoard(selectedBusiness, boardId, updates)}
          />
        )}
        {!selectedBusiness && (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p className="text-lg">Select a business from the sidebar or add a new one to get started</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

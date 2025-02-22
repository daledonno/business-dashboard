import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Dashboard = () => {
  // Load saved items from localStorage or initialize an empty array
  const [items, setItems] = useState<{ title: string; description: string }[]>([]);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
    setItems(savedItems);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dashboardItems', JSON.stringify(items));
  }, [items]);

  // Add a new item
  const addItem = () => {
    setItems([...items, { title: '', description: '' }]);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Update an item's title or description
  const updateItem = (index: number, field: 'title' | 'description', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="text-lg font-semibold"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="Description"
                className="resize-none"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button onClick={addItem} className="mt-6">
        Add New Item
      </Button>
    </div>
  );
};

export default Dashboard;
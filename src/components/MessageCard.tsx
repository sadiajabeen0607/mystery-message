import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";



const MessageCard = ({ message, onMessageDelete }) => {
  const [loading, setLoading] = useState(false); // For handling loading state

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true); // Start loading
      await axios.delete(`/api/delete-message/${message._id}`);

      toast.success("Message deleted successfully"); // Success message
      onMessageDelete(message._id); // Optimistic UI update
    } catch (err) {
      toast.error("Error deleting message"); // Error message
      console.error("Error deleting message:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row justify-between items-start">
        {/* ✅ Content on Left */}
        <div>
          <CardTitle className="text-2xl font-semibold">
            {message.content}
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm mt-1">
            {new Date(message.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </CardDescription>
        </div>

        {/* ✅ Delete Button (X) on Right */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={loading}>
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;

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
import { MessageInput } from "@/schemas/messageSchema";

// Extend your Zod schema type to include database fields
type Message = MessageInput & {
  _id: string;
  createdAt: Date | string;
};

type MessageCardProps = {
  message: Message;
  onMessageDelete: (id: string) => void;
};

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/delete-message/${message._id}`);
      toast.success("Message deleted successfully");
      onMessageDelete(message._id);
    } catch (err) {
      toast.error("Error deleting message");
      console.error("Error deleting message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row justify-between items-start">
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={loading} className="p-5">
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

"use client";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserProfile = () => {
  const params = useParams();
  const username = params.username as string;
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("suggested Messages", suggestedMessages);

  //  React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<{ content: string }>({
    resolver: zodResolver(messageSchema),
  });

  //fetch suggested messages from backend
  const fetchSuggestedMessages = async () => {
    setLoading(true);
    setSuggestedMessages([]); // Reset messages before fetching

    try {
      const response = await fetch("/api/suggest-messages", { method: "POST" });

      if (!response.body) throw new Error("Failed to read response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let receivedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        receivedText += chunk;

        // Ensure we append messages progressively
        const newMessages = receivedText.split("||").filter(Boolean);

        setSuggestedMessages((prev) => [...prev, ...newMessages]); // Properly update state
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suggested messages");
    } finally {
      setLoading(false);
    }
  };

  // fetch messages when component loads for the 1st time
  useEffect(() => {
    fetchSuggestedMessages();
  }, []);

  // API call
  const onSubmit = async (data: { content: string }) => {
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content: data.content,
      });
  
      toast.success(response.data.message);
      setValue("content", "");
    } catch (error: any) {
      // Suppress Next.js red box by safely catching all Axios errors
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
  
        if (status === 403) {
          toast.error("User is not accepting messages at the moment.");
        } else {
          toast.error(error.response?.data?.message || "Something went wrong.");
        }
  
        // ✅ Prevent red error box in dev
        // console.error("Handled Axios error:", error.message);
      } else {
        toast.error("Unexpected error while sending message.");
        console.error("Unhandled error:", error);
      }
    }
  };
  
  
  

  const handleSuggestedMessage = (content: string) => {
    setValue("content", content);
    handleSubmit(onSubmit)();
  };

  return (
    <main className="w-full max-w-6xl mx-auto flex flex-grow flex-col justify-center px-4 py-12">
      <section className="mt-10">
        <h1 className="text-center text-2xl md:text-3xl font-bold">
          Public Profile Link
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5 flex flex-col">
          <span className="font-semibold">
            Send Anonymous Message to @{username}
          </span>
          <textarea
            placeholder="Write your anonymous message here."
            className="border rounded p-3 focus:outline-none"
            rows={2}
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <Button
            className="mt-4 mx-auto w-auto px-6"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send it"}
          </Button>
        </form>
      </section>

      <section className="my-5">
        <Button onClick={fetchSuggestedMessages}>
          {loading ? <Loader2 /> : "Suggest Messages"}
        </Button>
        <h3 className="font-semibold my-4">
          Click on any message below to select it.
        </h3>
        <div className="p-4 my-4 border border-gray-100">
          <h2 className="font-bold text-lg">Messages</h2>
          <div className="flex flex-col space-y-4 my-4">
            {loading ? (
              <>
                <div className="h-10 bg-gray-200 animate-pulse rounded flex items-center justify-center"><Loader2 /></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded flex items-center justify-center"><Loader2 /></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded flex items-center justify-center"><Loader2 /></div>
              </>
            ) : (
              suggestedMessages.map((message, index) => (
                <button
                  key={index}
                  className="border border-gray-100 rounded-sm p-2 text-center font-medium hover:bg-gray-100 transition"
                  onClick={() => handleSuggestedMessage(message)}
                >
                  {message}
                </button>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserProfile;

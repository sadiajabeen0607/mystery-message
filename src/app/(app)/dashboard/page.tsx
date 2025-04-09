"use client"
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Message, User } from '@/model/User';
import { acceptingMessageSchema } from '@/schemas/acceptingMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const Dashboard = () => {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const {data: session, status} = useSession();
  
    const form = useForm({
      resolver: zodResolver(acceptingMessageSchema)
    });

    const { register, watch, setValue} = form;

    const acceptMessages = watch('acceptMessages');

    // console.log("session 12", session);

    const handleDeleteMessage = (messageId: string) => {
      setMessages((prevMessage) => prevMessage.filter((message) => message._id !== messageId));
    }
  
  const fetchAcceptMessage = useCallback(async() => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get("/api/accept-messages");
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      console.log("Error while getting messages", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false);
    }

  }, [setValue]); 

  // Fetch messages
  const fetchMessages = useCallback(async(refresh = false) => {
    if(!session) return;
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>("/api/get-message");
      setMessages(response.data.messages || []);
      if(refresh) {
        toast.success("Showing latest messages")
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [session]);

  
  useEffect(() => {
    if(session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchMessages, fetchAcceptMessage]);

  // Handling isAcceptingMessage switch button
  const handleSwitchChange = async() => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false);
    }
  }

  
  if(status === undefined) {
    return (
      <div className='space-y-4 p-6'>
        <Skeleton className='h-6 w-1/2' />
        <Skeleton className='h-4 w-1/3' />
        <Skeleton className='h-20 w-full rounded-lg' />
      </div>
    )
  }

  if(!session || !session.user) {
    return <div className='flex items-center justify-center w-full max-w-6xl min-h-screen mx-auto'>
      <p className='text-2xl font-semibold'>Please login</p>
    </div>
  }

  const { username } = session?.user as User;

  // const baseUrl = `${window.location.protocol}//${window.location.host}`;

  // const profileUrl = `${baseUrl}/u/${username}`;

  const profileUrl = `${window.location.origin}/u/${username}`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success(`Copied to clipboard: ${profileUrl}`);
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'> User Dashboard</h1>

      <div className='mb-4'>
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input type='text' value={profileUrl} disabled className='p-2 mr-2 w-full' />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
        <span className='ml-2'> Accept Message: {acceptMessages ? 'On' : 'Off'}</span>
      </div>
      <Separator />

      <Button className='mt-4' variant='outline' onClick={(e) => {e.preventDefault(); fetchMessages(true)}}>
        {isLoading ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (<RefreshCcw className='w-4 h-4' />)}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard key={index} message={message} onMessageDelete={handleDeleteMessage} />
          ))
        ) : (
          <p className='text-red-500'>No Message to Display</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard

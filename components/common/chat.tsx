import Message from '@/components/common/message';
import useSWRInfinite from 'swr/infinite';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/client/useMutation';
import { useEffect, useRef, useState } from 'react';
import useInfiniteScroll from '@libs/client/useInfiniteScroll';
import { Chat } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface ChatProps {
  chatId: string | undefined;
  title: string;
}

interface MessageForm {
  message: string;
}

interface ChatMessage {
  id: number;
  message: string;
  user: {
    avatar?: string;
    id: number;
  };
}

interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}

interface ChatResponse {
  ok: true;
  chat: ChatWithMessages;
  lastPage: number;
}

export default function ChatRoom({ title, chatId }: ChatProps) {
  const { data: session } = useSession();
  const requestUrl = `/api/chats/${chatId}`;
  const scrollRef = useRef<HTMLDivElement>(null);
  const direction = 'up';
  const scrollId = 'chatBox';

  const getKey = (pageIndex: number, previousPageData: ChatResponse) => {
    if (pageIndex === 0) return chatId && `${requestUrl}?page=1`;
    if (pageIndex + 1 > previousPageData.lastPage) return null;
    return chatId && `${requestUrl}?page=${pageIndex + 1}`;
  };
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, setSize, mutate } = useSWRInfinite<ChatResponse>(
    getKey,
    fetcher,
    {
      refreshInterval: 1000
    }
  );

  const page = useInfiniteScroll(direction, scrollId);
  useEffect(() => {
    setSize(page);
  });

  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { loading }] = useMutation(
    `/api/chats/${chatId}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    sendMessage(form);
  };

  const [scrollHeight, setScrollHeight] = useState<number>(0);

  useEffect(() => {
    if (!data) return;

    const scrollBox = document.getElementById(scrollId);
    if (!scrollBox) {
      return;
    }

    if (page <= data[0].lastPage) {
      scrollBox.scrollTop = scrollBox.scrollHeight - scrollHeight;
      setScrollHeight(scrollBox.scrollHeight);
    }
  }, [data]);

  return (
    <div>
      <h2>{title}</h2>
      <div
        id={scrollId}
        className="h-[50vh] space-y-4 overflow-y-scroll px-4 py-5 pb-16"
      >
        {data
          ?.slice()
          .reverse()
          .map((messagePage) => {
            return messagePage.chat?.messages
              .slice()
              .reverse()
              .map((message) => (
                <Message
                  key={message.id}
                  message={message.message}
                  reversed={message.user.id === Number(session?.user?.id)}
                  avatarUrl={message.user.avatar}
                />
              ));
          })}
        <div id="divRef" ref={scrollRef} />
      </div>
      <div className="inset-x-0 py-2">
        <form
          onSubmit={handleSubmit(onValid)}
          className="relative mx-auto flex w-full max-w-lg items-center"
        >
          <input
            type="text"
            required
            {...register('message', { required: true })}
            className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button
              type="submit"
              className="flex items-center rounded-full bg-orange-500 p-2 hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

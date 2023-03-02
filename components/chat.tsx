/* eslint-disable react/button-has-type */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Message from '@components/message';
import useSWRInfinite from 'swr/infinite';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { useEffect, useRef, useState } from 'react';
import useInfiniteScroll from '@libs/client/useInfiniteScroll';
import { Chat } from '@prisma/client';

interface ChatProps {
  title: string;
  chatId: string | undefined;
}

interface MessageForm {
  message: string;
}

interface ChatMessage {
  message: string;
  id: number;
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
  const requestUrl = `/api/chats/${chatId}`;
  const { user } = useUser();
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
    void setSize(page);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div
        id={scrollId}
        className="h-[50vh] space-y-4 overflow-y-scroll py-5 px-4 pb-16"
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
                  reversed={message.user.id === user?.id}
                />
              ));
          })}
        <div id="divRef" ref={scrollRef} />
      </div>
      <div className="inset-x-0 py-2">
        <form
          onSubmit={(...args) => void handleSubmit(onValid)(...args)}
          className="relative mx-auto flex w-full  max-w-lg items-center"
        >
          <input
            type="text"
            {...register('message', { required: true })}
            className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

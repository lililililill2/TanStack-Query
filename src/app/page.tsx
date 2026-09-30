"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataList from "../components/DataList";
import { useDataStore } from "../zustand/Store";
interface Data {
  id: number;
  todo: string;
  userId: number;
}

interface DataResponse {
  todos: Data[];
  total: number;
  skip: number;
  limit: number;
}

export default function Page() {
  const queryClient = useQueryClient();

  const setData = useDataStore((state) => state.setData);

  const [text, setText] = useState("");

  const { data, isPending, isError } = useQuery<DataResponse>({
    queryKey: ["data"],

    queryFn: async () => {
      const response = await fetch("https://dummyjson.com/todos");

      if (!response.ok) {
        throw new Error("조회 실패");
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setData(data.todos);
    }
  }, [data, setData]);

  const addMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          todo: text,
          completed: false,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("추가 실패");
      }

      return response.json();
    },

    onSuccess: (newData) => {
      queryClient.setQueryData<DataResponse>(["data"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,

          todos: [newData, ...oldData.todos],
        };
      });
    },
  });

  if (isPending) {
    return <p>로딩중...</p>;
  }

  if (isError) {
    return <p>에러가 발생했습니다.</p>;
  }

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="내용 입력"
      />

      <button
        onClick={() => {
          if (text) {
            addMutation.mutate(text);
            setText("");
          }
        }}
      >
        추가
      </button>

      <hr />

      <DataList />
    </div>
  );
}

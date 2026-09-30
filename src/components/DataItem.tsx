"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface Props {
  item: Data;
}

export default function DataItem({ item }: Props) {
  const queryClient = useQueryClient();

  const { selectedId, setSelectedId } = useDataStore();

  const [editText, setEditText] = useState("");

  const updateMutation = useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          todo: text,
        }),
      });

      if (!response.ok) {
        throw new Error("수정 실패");
      }

      return response.json();
    },

    onSuccess: (updatedData) => {
      queryClient.setQueryData<DataResponse>(["data"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,

          todos: oldData.todos.map((item) =>
            item.id === updatedData.id ? updatedData : item,
          ),
        };
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      return response.json();
    },

    onSuccess: (_, id) => {
      queryClient.setQueryData<DataResponse>(["data"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,

          todos: oldData.todos.filter((item) => item.id !== id),
        };
      });
    },
  });

  return (
    <div>
      <button
        style={{
          borderRadius: 8,
        }}
        onClick={() => {
          setSelectedId(item.id);
          setEditText(item.todo);
        }}
      >
        {item.id}. {item.todo}
      </button>

      {selectedId === item.id && (
        <div>
          <p>ID: {item.id}</p>
          <p>작성자 ID: {item.userId}</p>

          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <button
            onClick={() => {
              if (editText) {
                updateMutation.mutate({
                  id: item.id,
                  text: editText,
                });
              }
            }}
          >
            수정
          </button>

          <button onClick={() => deleteMutation.mutate(item.id)}>삭제</button>
        </div>
      )}

      <hr />
    </div>
  );
}

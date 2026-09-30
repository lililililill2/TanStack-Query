"use client";

import DataItem from "./DataItem";
import { useDataStore } from "../zustand/Store";

export default function DataList() {
  const data = useDataStore((state) => state.data);

  return (
    <div>
      {data.map((item, index) => (
        <DataItem key={`${item.id}-${index}`} item={item} />
      ))}
    </div>
  );
}

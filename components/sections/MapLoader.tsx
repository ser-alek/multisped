"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(
  () => import("@/components/sections/Map").then((mod) => mod.Map),
  { ssr: false },
);

export function MapLoader() {
  return <DynamicMap />;
}

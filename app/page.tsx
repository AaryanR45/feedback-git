"use client";
import Board from "./components/Board";
import { SessionProvider } from "next-auth/react";

export default function Home() {
 return (
     <div>
      <SessionProvider>
        <Board></Board>
      </SessionProvider>
     </div>
  );
}

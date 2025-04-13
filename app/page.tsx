"use client";
import Board from "./components/Board";
import Header from"@/app/components/Header";
import { SessionProvider } from "next-auth/react";

export default function Home() {
 return (
     <div>
      <SessionProvider>
        <Header/>
        <Board></Board>
      </SessionProvider>
     </div>
  );
}

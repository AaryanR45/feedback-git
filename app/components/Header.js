"use client";
import Button from "./Button";
import Login from "@/app/components/icons/Login"
import Logout from"@/app/components/icons/Logout"
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;
  function logout(){
    signOut();
    }
    function login(){
        signIn('google');
    }
  return (
    <div className="max-w-4xl mx-auto flex gap-4 justify-end p-2 items-center">
      {isLoggedIn && (
        <>
        <span>
        Hello, {session.user.name}
        </span> 
          <Button className="shadow-sm shadow-gray-400 border border-gray-500 px-2 py-0" onClick={logout}>Logout<Login/></Button>
        </>
      )}
      {!isLoggedIn &&(
         <>
         <span>
         Not logged in
         </span>
         <Button primary className="shadow-sm shadow-gray-400  px-2 py-0" onClick={login}>Login<Logout/></Button>
         </>
        )}
    </div>
  );
}

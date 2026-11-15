"use client";

import React, { createContext, useContext } from "react";

interface AuthNavContextValue {
  registrationOpen: boolean;
  loginOpen: boolean;
}

const AuthNavContext = createContext<AuthNavContextValue>({
  registrationOpen: true,
  loginOpen: true,
});

export function AuthNavProvider({
  children,
  registrationOpen,
  loginOpen,
}: {
  children: React.ReactNode;
  registrationOpen: boolean;
  loginOpen: boolean;
}) {
  return (
    <AuthNavContext.Provider value={{ registrationOpen, loginOpen }}>
      {children}
    </AuthNavContext.Provider>
  );
}

export function useAuthNav() {
  return useContext(AuthNavContext);
}

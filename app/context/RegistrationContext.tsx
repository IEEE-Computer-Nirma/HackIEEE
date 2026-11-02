"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import RegistrationWizard from "@/app/components/registration/RegistrationWizard";

export type PortalTab = "registration" | "team" | "dashboard";

interface RegistrationContextType {
  isWizardOpen: boolean;
  activeTab: PortalTab;
  setActiveTab: (tab: PortalTab) => void;
  openWizard: (tab?: PortalTab) => void;
  closeWizard: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PortalTab>("registration");

  const openWizard = (tab: PortalTab = "registration") => {
    setActiveTab(tab);
    setIsWizardOpen(true);
  };

  const closeWizard = () => setIsWizardOpen(false);

  return (
    <RegistrationContext.Provider
      value={{
        isWizardOpen,
        activeTab,
        setActiveTab,
        openWizard,
        closeWizard,
      }}
    >
      {children}
      <RegistrationWizard
        isOpen={isWizardOpen}
        onClose={closeWizard}
        initialTab={activeTab}
      />
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
}

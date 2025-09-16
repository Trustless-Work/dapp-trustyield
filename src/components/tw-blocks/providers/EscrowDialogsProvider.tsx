"use client";

import * as React from "react";
import { createContext, useContext, useMemo, useState } from "react";

export type DialogState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export type DialogStates = {
  second: DialogState;
  successRelease: DialogState;
  fundYield: DialogState;
};

type EscrowDialogsContextType = DialogStates;

const EscrowDialogsContext = createContext<
  EscrowDialogsContextType | undefined
>(undefined);

export function EscrowDialogsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [secondOpen, setSecondOpen] = useState(false);
  const [successReleaseOpen, setSuccessReleaseOpen] = useState(false);
  const [fundYieldOpen, setFundYieldOpen] = useState(false);

  const value = useMemo<EscrowDialogsContextType>(
    () => ({
      // Detail Escrow Dialog
      second: { isOpen: secondOpen, setIsOpen: setSecondOpen },

      // Success Release Dialog
      successRelease: {
        isOpen: successReleaseOpen,
        setIsOpen: setSuccessReleaseOpen,
      },

      // Fund Yield Dialog
      fundYield: {
        isOpen: fundYieldOpen,
        setIsOpen: setFundYieldOpen,
      },
    }),
    [secondOpen, successReleaseOpen, fundYieldOpen]
  );

  return (
    <EscrowDialogsContext.Provider value={value}>
      {children}
    </EscrowDialogsContext.Provider>
  );
}

export function useEscrowDialogs() {
  const ctx = useContext(EscrowDialogsContext);
  if (!ctx) {
    throw new Error(
      "useEscrowDialogs must be used within EscrowDialogsProvider"
    );
  }
  return ctx;
}

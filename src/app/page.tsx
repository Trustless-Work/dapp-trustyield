"use client";

import React, { Suspense } from "react";
import { EscrowsBySignerCards } from "@/components/tw-blocks/escrows/escrows-by-signer/cards/EscrowsCards";
import { InitializeEscrowDialog } from "@/components/tw-blocks/escrows/single-release/initialize-escrow/dialog/InitializeEscrow";
import { WalletButton } from "@/components/tw-blocks/wallet-kit/WalletButtons";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold">Trust Yield</h2>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletButton />
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="container">
          <div className="flex w-full mb-4 justify-end">
            <div className="flex w-1/6">
              <InitializeEscrowDialog />
            </div>
          </div>

          <Suspense fallback={null}>
            <EscrowsBySignerCards />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

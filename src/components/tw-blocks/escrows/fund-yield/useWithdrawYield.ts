import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fundYieldSchema, type FundYieldValues } from "./schema";
import { toast } from "sonner";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { useEscrowDialogs } from "@/components/tw-blocks/providers/EscrowDialogsProvider";
import { useEscrowsMutations } from "../../tanstack/useEscrowsMutations";
import { FundEscrowPayload } from "@trustless-work/escrow";

export function useWithdrawYield() {
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
  const { withdrawYieldEscrow } = useEscrowsMutations();
  const { fundYield } = useEscrowDialogs();

  const form = useForm<FundYieldValues>({
    resolver: zodResolver(fundYieldSchema),
    defaultValues: {
      amount: 0,
    },
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (payload: FundYieldValues) => {
    try {
      setIsSubmitting(true);

      // Validate that user has enough balance to withdraw
      const withdrawAmount =
        typeof payload.amount === "string"
          ? Number(payload.amount)
          : payload.amount;

      const currentBalance = selectedEscrow?.balance || 0;

      if (withdrawAmount > currentBalance) {
        toast.error("Insufficient balance for withdrawal");
        return;
      }

      /**
       * Create the final payload for the fund yield mutation
       * Using the same structure as fund escrow since yields use escrow contracts
       *
       * @param payload - The payload from the form
       * @returns The final payload for the fund yield mutation
       */
      const finalPayload: FundEscrowPayload = {
        amount: withdrawAmount,
        contractId: selectedEscrow?.contractId || "",
        signer: walletAddress || "",
      };

      /**
       * Call the fund escrow mutation (same for yields)
       *
       * @param payload - The final payload for the fund yield mutation
       * @param type - The type of the escrow
       * @param address - The address of the escrow
       */
      await withdrawYieldEscrow.mutateAsync({
        payload: finalPayload,
        type: selectedEscrow?.type || "multi-release",
        address: walletAddress || "",
      });

      // Update local escrow balance
      updateEscrow({
        ...selectedEscrow,
        yieldBalance: (selectedEscrow?.yieldBalance || 0) - withdrawAmount,
        balance: currentBalance + withdrawAmount,
      });

      toast.success("Withdrawal completed successfully");
    } catch (error) {
      toast.error(handleError(error as ErrorResponse).message);
    } finally {
      setIsSubmitting(false);
      form.reset();
      fundYield.setIsOpen(false);
    }
  };

  return { form, handleSubmit, isSubmitting };
}

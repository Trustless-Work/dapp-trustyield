import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fundYieldSchema, type FundYieldValues } from "./schema";
import { toast } from "sonner";
import { FundEscrowPayload } from "@trustless-work/escrow";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useEscrowsMutations } from "@/components/tw-blocks/tanstack/useEscrowsMutations";
import {
  ErrorResponse,
  handleError,
} from "@/components/tw-blocks/handle-errors/handle";
import { useWalletContext } from "@/components/tw-blocks/wallet-kit/WalletProvider";
import { useEscrowDialogs } from "@/components/tw-blocks/providers/EscrowDialogsProvider";

export function useFundYield() {
  const { depositYieldEscrow } = useEscrowsMutations();
  const { selectedEscrow, updateEscrow } = useEscrowContext();
  const { walletAddress } = useWalletContext();
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

      /**
       * Create the final payload for the fund yield mutation
       * Using the same structure as fund escrow since yields use escrow contracts
       *
       * @param payload - The payload from the form
       * @returns The final payload for the fund yield mutation
       */
      const finalPayload: FundEscrowPayload = {
        amount:
          typeof payload.amount === "string"
            ? Number(payload.amount)
            : payload.amount,
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
      await depositYieldEscrow.mutateAsync({
        payload: finalPayload,
        type: selectedEscrow?.type || "multi-release",
        address: walletAddress || "",
      });

      updateEscrow({
        ...selectedEscrow,
        balance: 0,
        yieldBalance: (selectedEscrow?.yieldBalance || 0) + finalPayload.amount,
      });

      toast.success("Yield funded successfully");

      // do something with the response ...
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

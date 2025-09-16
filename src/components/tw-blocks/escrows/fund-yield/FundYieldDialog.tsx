import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { useFundYield } from "./useFundYield";
import { useWithdrawYield } from "./useWithdrawYield";
import { useEscrowContext } from "@/components/tw-blocks/providers/EscrowProvider";
import { useEscrowDialogs } from "@/components/tw-blocks/providers/EscrowDialogsProvider";
import { formatCurrency } from "../../helpers/format.helper";

export const FundYieldDialog = () => {
  const depositHook = useFundYield();
  const withdrawHook = useWithdrawYield();
  const { selectedEscrow } = useEscrowContext();
  const { fundYield } = useEscrowDialogs();
  const { isOpen, setIsOpen } = fundYield;

  // Reset forms when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      depositHook.form.reset();
      withdrawHook.form.reset();
    }
  }, [isOpen, depositHook.form, withdrawHook.form]);

  const handleDepositClick = async () => {
    const amount = selectedEscrow?.balance || 0;
    await depositHook.handleSubmit({ amount });
  };

  const handleWithdrawClick = async () => {
    const amount = selectedEscrow?.balance || 0;
    await withdrawHook.handleSubmit({ amount });
  };

  const renderOverview = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Manage Yield
        </DialogTitle>
        <DialogDescription>
          View your current yield balance and choose to deposit more funds or
          withdraw existing balance.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Current Balance */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Current Balance
            </span>
            <span className="font-semibold text-lg">
              {formatCurrency(
                selectedEscrow?.yieldBalance || 0,
                selectedEscrow?.trustline?.name || ""
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDepositClick}
            className="flex items-center gap-2 h-12 cursor-pointer"
            variant="default"
            disabled={depositHook.isSubmitting}
          >
            {depositHook.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpCircle className="h-4 w-4" />
            )}
            {depositHook.isSubmitting ? "Depositing..." : "Deposit"}
          </Button>
          <Button
            onClick={handleWithdrawClick}
            className="flex items-center gap-2 h-12 cursor-pointer"
            variant="outline"
            disabled={withdrawHook.isSubmitting}
          >
            {withdrawHook.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownCircle className="h-4 w-4" />
            )}
            {withdrawHook.isSubmitting ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer text-xs"
        >
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">{renderOverview()}</DialogContent>
    </Dialog>
  );
};

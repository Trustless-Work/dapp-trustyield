"use client";

import React from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatText } from "@/components/tw-blocks/helpers/format.helper";
import { FundYieldDialog } from "../../fund-yield/FundYieldDialog";

interface StatisticsCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  value: ReactNode;
  subValue?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconSize?: number;
  fundedBy?: string;
  isYield?: boolean;
}

export const StatisticsCard = ({
  title,
  description,
  icon: Icon,
  iconColor,
  value,
  subValue,
  actionLabel,
  onAction,
  className,
  iconSize = 30,
  fundedBy,
  isYield = false,
}: StatisticsCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer w-full py-1",
        className,
        isYield && "animate-floating-shadow"
      )}
    >
      <CardContent className="py-4 px-8 min-h-20">
        <div className="flex items-center justify-between">
          <div className="flex">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>

          <Icon className={iconColor} size={iconSize} />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <h3 className="text-2xl font-semibold">{value}</h3>
            {subValue}
          </div>
          {fundedBy && (
            <Badge
              variant="outline"
              className="text-xs text-muted-foreground uppercase"
            >
              Funded by {formatText(fundedBy)}
            </Badge>
          )}
          {actionLabel && onAction && (
            <Button
              variant="link"
              type="button"
              onClick={onAction}
              className="text-xs text-muted-foreground my-0 p-0 h-auto"
            >
              {actionLabel}
            </Button>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          {description && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}

          {isYield && <FundYieldDialog />}
        </div>
      </CardContent>
    </Card>
  );
};

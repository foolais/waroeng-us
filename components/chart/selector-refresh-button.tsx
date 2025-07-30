import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TimeRange } from "@/types/types";

interface SelectorRefreshButtonProps {
  timeRange: TimeRange;
  handleTimeRangeChange: (value: TimeRange) => void;
  onRefresh: boolean;
  handleRefresh: () => void;
  isWithSelector: boolean;
  isWithAll?: boolean;
}

const SelectorRefreshButton = ({
  timeRange,
  handleTimeRangeChange,
  onRefresh,
  handleRefresh,
  isWithSelector,
  isWithAll = false,
}: SelectorRefreshButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleRefresh}
        variant="outline"
        size="sm"
        className="w-max"
      >
        <RefreshCcw className={`h-4 w-4 ${onRefresh && "animate-spin"}`} />
      </Button>
      {isWithSelector && (
        <Select
          value={timeRange}
          onValueChange={(value) => handleTimeRangeChange(value as TimeRange)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {isWithAll && <SelectItem value="all">Semua</SelectItem>}
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="3days">3 Hari</SelectItem>
            <SelectItem value="7days">7 Hari</SelectItem>
            <SelectItem value="15days">15 Hari</SelectItem>
            <SelectItem value="1month">1 Bulan</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SelectorRefreshButton;

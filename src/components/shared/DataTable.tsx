import { Loading } from '@/components/shared/Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const stickyColumnClassName = {
  left: 'sticky left-0 z-[2] bg-white dark:bg-card group-hover:bg-muted/50 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]',
  right:
    'sticky right-0 z-[2] bg-white dark:bg-card text-right group-hover:bg-muted/50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.08)]',
} as const;

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  sticky?: 'left' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <Loading layout="inline" hideLabel />;
  }

  if (data.length === 0) {
    return (
      <p className="py-card-sm text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              className={cn(
                column.className,
                column.sticky && stickyColumnClassName[column.sticky],
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={getRowKey(row)}
            className={cn('group', onRowClick && 'cursor-pointer')}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {columns.map((column) => (
              <TableCell
                key={column.id}
                className={cn(
                  column.className,
                  column.sticky && stickyColumnClassName[column.sticky],
                )}
              >
                {column.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

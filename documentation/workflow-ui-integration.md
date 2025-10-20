# Workflow, UI Components & Integration Guides - Taman Kehati

## Daftar Isi

1. [Workflow dan Manajemen Data](#workflow-dan-manajemen-data)
2. [UI/UX Component Library](#uiux-component-library)
3. [API Integration Patterns](#api-integration-patterns)
4. [Responsivitas dan Mobile Design](#responsivitas-dan-mobile-design)
5. [Aksesibilitas (WCAG 2.1 AA)](#aksesibilitas-wcag-21-aa)
6. [Performance Optimization](#performance-optimization)

---

## Workflow dan Manajemen Data

### 1. Content Status Workflow

```typescript
// src/types/workflow.ts
export enum WorkflowStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface WorkflowTransition {
  from: WorkflowStatus;
  to: WorkflowStatus;
  action: string;
  permissions: Permission[];
  requiresReason?: boolean;
}

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  {
    from: WorkflowStatus.DRAFT,
    to: WorkflowStatus.IN_REVIEW,
    action: 'submit_for_review',
    permissions: ['submit_content'],
  },
  {
    from: WorkflowStatus.IN_REVIEW,
    to: WorkflowStatus.APPROVED,
    action: 'approve',
    permissions: ['approve_content'],
  },
  {
    from: WorkflowStatus.IN_REVIEW,
    to: WorkflowStatus.REJECTED,
    action: 'reject',
    permissions: ['reject_content'],
    requiresReason: true,
  },
  {
    from: WorkflowStatus.REJECTED,
    to: WorkflowStatus.DRAFT,
    action: 'revise',
    permissions: ['update_content'],
  },
  {
    from: WorkflowStatus.APPROVED,
    to: WorkflowStatus.PUBLISHED,
    action: 'publish',
    permissions: ['approve_content'],
  },
  {
    from: WorkflowStatus.PUBLISHED,
    to: WorkflowStatus.ARCHIVED,
    action: 'archive',
    permissions: ['delete_content'],
  },
];
```

### 2. Workflow Status Component

```typescript
// src/components/workflow/WorkflowStatus.tsx
interface WorkflowStatusProps {
  status: WorkflowStatus;
  showTimeline?: boolean;
  onStatusChange?: (newStatus: WorkflowStatus, reason?: string) => void;
  editable?: boolean;
  workflowHistory?: WorkflowHistoryItem[];
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  status,
  showTimeline = false,
  onStatusChange,
  editable = false,
  workflowHistory = []
}) => {
  const { hasPermission } = usePermissions();
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const statusConfig = {
    draft: {
      label: 'Draf',
      color: 'gray',
      icon: FileText,
      description: 'Konten sedang dibuat'
    },
    in_review: {
      label: 'Dalam Review',
      color: 'yellow',
      icon: Clock,
      description: 'Menunggu persetujuan'
    },
    approved: {
      label: 'Disetujui',
      color: 'green',
      icon: CheckCircle,
      description: 'Konten telah disetujui'
    },
    rejected: {
      label: 'Ditolak',
      color: 'red',
      icon: XCircle,
      description: 'Konten ditolak, perlu revisi'
    },
    published: {
      label: 'Diterbitkan',
      color: 'blue',
      icon: Globe,
      description: 'Konten telah dipublikasi'
    },
    archived: {
      label: 'Diarsipkan',
      color: 'gray',
      icon: Archive,
      description: 'Konten tidak aktif'
    }
  };

  const currentConfig = statusConfig[status];

  const availableTransitions = WORKFLOW_TRANSITIONS.filter(
    transition => 
      transition.from === status && 
      hasPermission(transmission.permissions)
  );

  const handleStatusChange = (newStatus: WorkflowStatus) => {
    const transition = availableTransitions.find(t => t.to === newStatus);
    
    if (transition?.requiresReason) {
      const reason = prompt('Alasan perubahan status:');
      if (reason) {
        onStatusChange?.(newStatus, reason);
      }
    } else {
      onStatusChange?.(newStatus);
    }
    setIsChangingStatus(false);
  };

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${currentConfig.color === 'gray' ? 'bg-gray-100 text-gray-600' :
              currentConfig.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
              currentConfig.color === 'green' ? 'bg-green-100 text-green-600' :
              currentConfig.color === 'red' ? 'bg-red-100 text-red-600' :
              currentConfig.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-600'}
          `}>
            <currentConfig.icon className="w-5 h-5" />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">
              {currentConfig.label}
            </h3>
            <p className="text-sm text-gray-500">
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* Status Change Actions */}
        {editable && availableTransitions.length > 0 && (
          <DropdownMenu open={isChangingStatus} onOpenChange={setIsChangingStatus}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Ubah Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {availableTransitions.map((transition) => {
                const targetConfig = statusConfig[transition.to];
                return (
                  <DropdownMenuItem
                    key={transition.to}
                    onClick={() => handleStatusChange(transition.to)}
                  >
                    <targetConfig.icon className="w-4 h-4 mr-2" />
                    {transition.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Timeline */}
      {showTimeline && workflowHistory.length > 0 && (
        <div className="ml-13 space-y-3">
          {workflowHistory.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Status diubah ke <span className="font-medium">
                    {statusConfig[item.status].label}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {item.user_name} • {format(new Date(item.created_at), 'dd MMM yyyy HH:mm')}
                </p>
                {item.reason && (
                  <p className="text-sm text-gray-600 mt-1">
                    Alasan: {item.reason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3. Bulk Workflow Actions

```typescript
// src/components/workflow/BulkWorkflowActions.tsx
interface BulkWorkflowActionsProps {
  selectedItems: number[];
  contentType: 'flora' | 'fauna' | 'taman' | 'berita';
  onActionComplete: () => void;
}

const BulkWorkflowActions: React.FC<BulkWorkflowActionsProps> = ({
  selectedItems,
  contentType,
  onActionComplete
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasPermission } = usePermissions();

  const handleBulkAction = async (action: string, requiresReason = false) => {
    let reason = '';
    
    if (requiresReason) {
      reason = prompt(`Alasan ${action}:`) || '';
      if (!reason) return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/v1/${contentType}/bulk-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_ids: selectedItems,
          action,
          reason
        })
      });

      if (response.ok) {
        toast.success(`${action} berhasil dilakukan pada ${selectedItems.length} item`);
        onActionComplete();
      } else {
        throw new Error('Gagal melakukan aksi bulk');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat melakukan aksi bulk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              {selectedItems.length} item dipilih
            </p>
            <p className="text-xs text-green-600">
              Pilih aksi yang akan dilakukan pada item yang dipilih
            </p>
          </div>
          
          <div className="flex space-x-2">
            {hasPermission('approve_content') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('approve')}
                disabled={isSubmitting}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Setujui
              </Button>
            )}
            
            {hasPermission('reject_content') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('reject', true)}
                disabled={isSubmitting}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak
              </Button>
            )}
            
            {hasPermission('delete_content') && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm(`Hapus ${selectedItems.length} item yang dipilih?`)) {
                    handleBulkAction('delete');
                  }
                }}
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## UI/UX Component Library

### 1. Enhanced Form Components

```typescript
// src/components/forms/FormBuilder.tsx
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: z.ZodSchema;
  description?: string;
  dependsOn?: string;
  condition?: (value: any) => boolean;
}

interface FormBuilderProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: any) => Promise<void>;
  submitButtonText?: string;
  isLoading?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  initialValues,
  onSubmit,
  submitButtonText = "Simpan",
  isLoading = false
}) => {
  const form = useForm({
    defaultValues: initialValues,
    resolver: zodSchema(fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {} as Record<string, z.ZodSchema>))
  });

  const watchedValues = form.watch();

  const visibleFields = fields.filter(field => {
    if (!field.dependsOn) return true;
    return field.condition?.(watchedValues[field.dependsOn]);
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {visibleFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField, fieldState }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </FormLabel>
                
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                
                <FormControl>
                  {field.type === 'text' && (
                    <Input
                      {...formField}
                      placeholder={field.placeholder}
                    />
                  )}
                  
                  {field.type === 'textarea' && (
                    <Textarea
                      {...formField}
                      placeholder={field.placeholder}
                      rows={4}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <Select
                      value={formField.value}
                      onValueChange={formField.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {field.type === 'multiselect' && (
                    <MultiSelect
                      options={field.options || []}
                      value={formField.value || []}
                      onChange={formField.onChange}
                      placeholder={field.placeholder}
                    />
                  )}
                  
                  {field.type === 'file' && (
                    <FileUpload
                      value={formField.value}
                      onChange={formField.onChange}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  )}
                  
                  {field.type === 'date' && (
                    <DatePicker
                      value={formField.value}
                      onChange={formField.onChange}
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <Input
                      {...formField}
                      type="number"
                      placeholder={field.placeholder}
                      onChange={(e) => formField.onChange(Number(e.target.value))}
                    />
                  )}
                </FormControl>
                
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        ))}
        
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

### 2. Advanced Data Table

```typescript
// src/components/tables/AdvancedDataTable.tsx
interface AdvancedDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  onSelectionChange?: (selectedRows: T[]) => void;
  actions?: ActionDef<T>[];
}

interface ActionDef<T> {
  label: string;
  icon: React.ComponentType;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  destructive?: boolean;
}

const AdvancedDataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  sortable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  selectionMode = 'none',
  onSelectionChange,
  actions = []
}: AdvancedDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number | string>>(new Set());
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize
  });

  // Enhanced columns with selection and actions
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];

    // Add selection column
    if (selectionMode !== 'none') {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Add actions column
    if (actions.length > 0) {
      cols.push({
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(row.original)}
                  disabled={action.disabled?.(row.original)}
                  className={action.destructive ? 'text-red-600' : ''}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      });
    }

    return cols;
  }, [columns, selectionMode, actions]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Column filters
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [data, searchTerm, filters]);

  const table = useReactTable({
    data: filteredData,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPaginationState,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(table.getState().rowSelection)
        : updater;
      
      setSelectedRows(new Set(Object.keys(newSelection).map(Number)));
      
      const selectedData = filteredData.filter((_, index) => 
        newSelection[index]
      );
      onSelectionChange?.(selectedData);
    },
    state: {
      sorting,
      pagination: paginationState,
      rowSelection: Array.from(selectedRows).reduce((acc, index) => {
        acc[index] = true;
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  const handleExport = () => {
    const csvContent = generateCSV(filteredData, columns);
    downloadCSV(csvContent, 'export.csv');
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
          
          {filterable && (
            <DataFilters
              columns={columns}
              data={data}
              filters={filters}
              onFiltersChange={setFilters}
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          {exportable && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
          
          {selectedRows.size > 0 && (
            <div className="text-sm text-gray-600">
              {selectedRows.size} item dipilih
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={enhancedColumns.length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <div className="flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    "Tidak ada data."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Menampilkan {table.getFilteredSelectedRowModel().rows.length} dari{' '}
            {table.getFilteredRowModel().rows.length} item
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({
                length: table.getPageCount()
              }).map((_, index) => (
                <Button
                  key={index}
                  variant={table.getState().pagination.pageIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 3. Modal System

```typescript
// src/components/ui/ModalSystem.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl w-full mx-4
          ${sizeClasses[size]}
          max-h-[90vh] overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            )}
          </div>
          
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'default',
  isLoading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={message}
      size="sm"
    >
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
```

---

## API Integration Patterns

### 1. Enhanced API Service Layer

```typescript
// src/services/api.ts
class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add auth header
    const token = getAuthToken();
    const headers = {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle unauthorized
      if (response.status === 401) {
        await handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle forbidden
      if (response.status === 403) {
        throw new Error('Forbidden - Insufficient permissions');
      }

      // Handle other errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  // File upload
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const token = getAuthToken();
    const headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

export const apiService = new ApiService();

// Typed service classes
export class FloraService {
  async search(params: FloraSearchParams): Promise<FloraListResponse> {
    return apiService.get<FloraListResponse>('/api/public/flora', params);
  }

  async getById(id: number): Promise<Flora> {
    return apiService.get<Flora>(`/api/public/flora/${id}`);
  }

  async adminList(params: AdminFloraParams): Promise<FloraListResponse> {
    return apiService.get<FloraListResponse>('/api/v1/flora', params);
  }

  async create(data: FloraCreateData): Promise<Flora> {
    return apiService.post<Flora>('/api/v1/flora', data);
  }

  async update(id: number, data: FloraUpdateData): Promise<Flora> {
    return apiService.put<Flora>(`/api/v1/flora/${id}`, data);
  }

  async submit(id: number): Promise<void> {
    return apiService.post<void>(`/api/v1/flora/${id}/submit`);
  }

  async approve(id: number): Promise<void> {
    return apiService.post<void>(`/api/v1/flora/${id}/approve`);
  }

  async reject(id: number, reason: string): Promise<void> {
    return apiService.post<void>(`/api/v1/flora/${id}/reject`, { reason });
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(`/api/v1/flora/${id}`);
  }

  async bulkAction(data: BulkActionData): Promise<void> {
    return apiService.post<void>('/api/v1/flora/bulk-action', data);
  }

  async uploadImage(file: File, floraId: number): Promise<FloraImage> {
    return apiService.uploadFile<FloraImage>('/api/v1/flora/upload-image', file, {
      flora_id: floraId
    });
  }
}

export const floraService = new FloraService();
```

### 2. React Query Integration

```typescript
// src/hooks/useApiQueries.ts
export const useFloraList = (params: FloraSearchParams) => {
  return useQuery({
    queryKey: ['flora', 'list', params],
    queryFn: () => floraService.search(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFloraDetail = (id: number) => {
  return useQuery({
    queryKey: ['flora', 'detail', id],
    queryFn: () => floraService.getById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useFloraAdminList = (params: AdminFloraParams) => {
  return useQuery({
    queryKey: ['admin', 'flora', 'list', params],
    queryFn: () => floraService.adminList(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateFlora = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floraService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flora'] });
      queryClient.setQueryData(['flora', 'detail', data.id], data);
      toast.success('Flora berhasil ditambahkan');
    },
    onError: (error) => {
      toast.error('Gagal menambah flora: ' + error.message);
    },
  });
};

export const useUpdateFlora = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FloraUpdateData }) =>
      floraService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flora'] });
      queryClient.setQueryData(['flora', 'detail', data.id], data);
      toast.success('Flora berhasil diperbarui');
    },
    onError: (error) => {
      toast.error('Gagal memperbarui flora: ' + error.message);
    },
  });
};

export const useSubmitFlora = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floraService.submit,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flora'] });
      queryClient.invalidateQueries({ queryKey: ['flora', 'detail', id] });
      toast.success('Flora dikirim untuk persetujuan');
    },
    onError: (error) => {
      toast.error('Gagal mengirim flora: ' + error.message);
    },
  });
};

// Optimistic updates for better UX
export const useOptimisticFloraUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FloraUpdateData }) =>
      floraService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['flora', 'detail', id] });

      // Snapshot the previous value
      const previousFlora = queryClient.getQueryData<Flora>(['flora', 'detail', id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['flora', 'detail', id], (old: Flora) => ({
        ...old,
        ...data,
      }));

      // Return a context object with the snapshotted value
      return { previousFlora };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['flora', 'detail', id], context?.previousFlora);
      toast.error('Gagal memperbarui flora');
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['flora', 'detail', id] });
    },
  });
};
```

---

## Responsivitas dan Mobile Design

### 1. Mobile-First Components

```typescript
// src/components/responsive/MobileTable.tsx
interface MobileTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

const MobileTable = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false
}: MobileTableProps<T>) => {
  if (loading) {
    return <MobileTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {data.map((row, index) => (
        <Card 
          key={index} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onRowClick?.(row)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {columns.map((column) => (
                <div key={column.id} className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">
                    {column.header as string}
                  </span>
                  <div className="text-sm text-gray-900 text-right max-w-[60%]">
                    {flexRender(column.cell, {
                      getValue: () => row[column.accessorKey as keyof T],
                      row: { original: row, getValue: (key: string) => row[key as keyof T] }
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Responsive wrapper
const ResponsiveTable = <T extends Record<string, any>>(props: DataTableProps<T>) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileTable {...props} />;
  }

  return <AdvancedDataTable {...props} />;
};
```

### 2. Adaptive Layout System

```typescript
// src/components/layout/AdaptiveLayout.tsx
interface AdaptiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  sidebar,
  header,
  footer
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {header && (
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {isMobile && sidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              {header}
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        {!isMobile && sidebar && (
          <aside className="w-64 bg-white border-r">
            {sidebar}
          </aside>
        )}

        {/* Mobile Sidebar */}
        {isMobile && sidebar && (
          <>
            <div
              className={`
                fixed inset-0 z-50 bg-black/50 transition-opacity
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              `}
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside
              className={`
                fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sidebar}
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
};
```

### 3. Touch-Friendly Components

```typescript
// src/components/ui/TouchButton.tsx
interface TouchButtonProps extends ButtonProps {
  touchSize?: 'sm' | 'md' | 'lg';
}

const TouchButton: React.FC<TouchButtonProps> = ({
  touchSize = 'md',
  className = '',
  children,
  ...props
}) => {
  const touchSizeClasses = {
    sm: 'min-h-[44px] min-w-[44px]', // iOS minimum touch target
    md: 'min-h-[48px] min-w-[48px]', // Android recommendation
    lg: 'min-h-[52px] min-w-[52px]'
  };

  return (
    <Button
      className={`${touchSizeClasses[touchSize]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

// Swipe Actions for mobile
const SwipeActions: React.FC<{
  children: React.ReactNode;
  leftActions?: React.ReactNode[];
  rightActions?: React.ReactNode[];
}> = ({ children, leftActions = [], rightActions = [] }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX - translateX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 120;
    const clampedX = Math.max(-maxSwipe, Math.min(maxSwipe, currentX.current));
    
    setTranslateX(clampedX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if swipe should snap to action
    const threshold = 60;
    
    if (currentX.current > threshold && leftActions.length > 0) {
      setTranslateX(120);
    } else if (currentX.current < -threshold && rightActions.length > 0) {
      setTranslateX(-120);
    } else {
      setTranslateX(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 h-full flex items-center z-10">
          {leftActions.map((action, index) => (
            <div key={index} className="bg-blue-500 text-white px-4 h-full flex items-center">
              {action}
            </div>
          ))}
        </div>
      )}
      
      {/* Right Actions */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center z-10">
          {rightActions.map((action, index) => (
            <div key={index} className="bg-red-500 text-white px-4 h-full flex items-center">
              {action}
            </div>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div
        className="relative bg-white transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};
```

---

## Aksesibilitas (WCAG 2.1 AA)

### 1. Accessible Form Components

```typescript
// src/components/forms/AccessibleField.tsx
interface AccessibleFieldProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

const AccessibleField: React.FC<AccessibleFieldProps> = ({
  label,
  description,
  error,
  required,
  children
}) => {
  const fieldId = useId();
  const descriptionId = useId();
  const errorId = useId();

  return (
    <div className="space-y-2">
      <Label
        htmlFor={fieldId}
        className={`
          text-sm font-medium
          ${error ? 'text-red-600' : 'text-gray-700'}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </Label>

      {React.cloneElement(children as React.ReactElement, {
        id: fieldId,
        'aria-describedby': [
          description ? descriptionId : undefined,
          error ? errorId : undefined,
        ].filter(Boolean).join(' '),
        'aria-invalid': error ? 'true' : 'false',
        'aria-required': required,
      })}

      {description && (
        <p id={descriptionId} className="text-sm text-gray-500">
          {description}
        </p>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
```

### 2. Accessible Navigation

```typescript
// src/components/navigation/AccessibleMenu.tsx
interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType;
  children?: MenuItem[];
}

const AccessibleMenu: React.FC<{
  items: MenuItem[];
  orientation?: 'horizontal' | 'vertical';
}> = ({ items, orientation = 'vertical' }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
      case 'Escape':
        setFocusedIndex(-1);
        break;
    }
  };

  const menuRole = orientation === 'horizontal' ? 'menubar' : 'menu';

  return (
    <div
      ref={menuRef}
      role={menuRole}
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={orientation === 'horizontal' ? 'flex space-x-4' : 'space-y-1'}
    >
      {items.map((item, index) => (
        <AccessibleMenuItem
          key={index}
          item={item}
          isFocused={focusedIndex === index}
          onFocus={() => setFocusedIndex(index)}
        />
      ))}
    </div>
  );
};

const AccessibleMenuItem: React.FC<{
  item: MenuItem;
  isFocused: boolean;
  onFocus: () => void;
}> = ({ item, isFocused, onFocus }) => {
  if (item.children) {
    return (
      <div className="relative">
        <button
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm
            ${isFocused ? 'bg-gray-100' : 'hover:bg-gray-50'}
          `}
          aria-haspopup="true"
          aria-expanded={false}
          onFocus={onFocus}
        >
          {item.icon && <item.icon className="w-4 h-4" />}
          <span>{item.label}</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>
        
        {/* Submenu would go here */}
      </div>
    );
  }

  const Element = item.href ? 'a' : 'button';
  
  return (
    <Element
      href={item.href}
      onClick={item.onClick}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-md text-sm
        ${isFocused ? 'bg-gray-100' : 'hover:bg-gray-50'}
      `}
      onFocus={onFocus}
    >
      {item.icon && <item.icon className="w-4 h-4" />}
      <span>{item.label}</span>
    </Element>
  );
};
```

### 3. Screen Reader Support

```typescript
// src/components/ui/SkipLink.tsx
const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 
                 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

// Live region for dynamic content updates
const LiveRegion: React.FC<{
  announcement: string;
  politeness?: 'polite' | 'assertive' | 'off';
}> = ({ announcement, politeness = 'polite' }) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

// Usage for form validation
const FormWithLiveValidation: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    setErrors(newErrors);
    
    // Announce errors to screen readers
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      announceToScreenReader(
        `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and fix.`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <LiveRegion announcement={getAnnouncementMessage()} />
    </form>
  );
};
```

---

## Performance Optimization

### 1. Code Splitting and Lazy Loading

```typescript
// Dynamic imports with loading states
const LazyFloraPage = dynamic(() => import('../pages/flora'), {
  loading: () => <PageSkeleton />,
  ssr: false // Client-side only for admin pages
});

const LazyDashboard = dynamic(() => import('../pages/dashboard'), {
  loading: () => <DashboardSkeleton />,
  ssr: false
});

// Component-level lazy loading
const LazyChart = dynamic(() => import('../components/charts/StatisticsChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});

// Route-based code splitting
const AdminRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={
      <ProtectedRoute requiredPermissions={['read_content']}>
        <LazyDashboard />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/flora" element={
      <ProtectedRoute requiredPermissions={['read_content']}>
        <LazyFloraPage />
      </ProtectedRoute>
    } />
  </Routes>
);
```

### 2. Image Optimization

```typescript
// Optimized image component with blur placeholder
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}> = ({ src, alt, width, height, priority = false, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate blur placeholder
  const blurDataURL = useMemo(() => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="50%" height="50%" fill="#e5e7eb" x="25%" y="25%" rx="4"/>
      </svg>`
    ).toString('base64')}`;
  }, [width, height]);

  if (error) {
    return (
      <div className={`
        flex items-center justify-center bg-gray-100 text-gray-400
        ${className}
      `} style={{ width, height }}>
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse">
          <div className="w-full h-full bg-gray-200 rounded" />
        </div>
      )}
    </div>
  );
};
```

### 3. Performance Monitoring

```typescript
// Performance monitoring hooks
const usePagePerformance = () => {
  useEffect(() => {
    // Measure Core Web Vitals
    const measurePerformance = () => {
      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics
        gtag('event', 'LCP', {
          event_category: 'Web Vitals',
          value: Math.round(lastEntry.startTime),
          non_interaction: true,
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
          
          gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            non_interaction: true,
          });
        });
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        console.log('CLS:', clsValue);
        
        gtag('event', 'CLS', {
          event_category: 'Web Vitals',
          value: Math.round(clsValue * 1000),
          non_interaction: true,
        });
      }).observe({ entryTypes: ['layout-shift'] });
    };

    measurePerformance();
  }, []);
};

// Bundle size monitoring
const useBundleAnalyzer = () => {
  useEffect(() => {
    // Monitor chunk loading performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource' && entry.name.includes('.chunk')) {
          console.log(`Chunk loaded: ${entry.name}, Size: ${entry.transferSize} bytes, Time: ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  }, []);
};
```

---

## Kesimpulan

Dokumentasi lengkap ini telah membahas aspek-aspek krusial dalam pengembangan Frontend Taman Kehati:

### 🔄 **Workflow Management**
- Sistem status konten yang terstruktur (Draft → Review → Approved → Published)
- Bulk actions untuk efisiensi manajemen konten
- Permission-based workflow transitions

### 🎨 **UI/UX Components**
- Component library yang konsisten dengan shadcn/ui
- Form builder yang dinamis dan accessible
- Advanced data table dengan sorting, filtering, dan pagination
- Modal system yang flexible

### 🔌 **API Integration**
- Service layer architecture yang clean dan maintainable
- React Query untuk state management dan caching
- Optimistic updates untuk UX yang lebih baik
- Error handling yang comprehensive

### 📱 **Responsivitas & Accessibility**
- Mobile-first design dengan adaptive layouts
- Touch-friendly components untuk pengalaman mobile
- WCAG 2.1 AA compliance untuk aksesibilitas
- Screen reader support dan keyboard navigation

### ⚡ **Performance Optimization**
- Code splitting dan lazy loading
- Image optimization dengan blur placeholders
- Core Web Vitals monitoring
- Bundle size analysis

Dengan mengikuti panduan ini, tim pengembang dapat membangun aplikasi Taman Kehati yang:
- **Scalable**: Arsitektur yang dapat berkembang dengan kebutuhan
- **Maintainable**: Code yang organized dan well-documented
- **Accessible**: Inklusif untuk semua pengguna
- **Performant**: Cepat dan optimal di berbagai devices
- **User-Friendly**: Interface yang intuitive dan easy to use
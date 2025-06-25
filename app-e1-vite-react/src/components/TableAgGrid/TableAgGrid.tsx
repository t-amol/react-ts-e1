import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  CsvExportModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  PinnedRowModule,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { Button, Card, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';

/*
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
*/
import columndefinitions from './columndefinitions.json';
import rowdata from './rowdata.json';
import { Download, Search, Upload } from "@mui/icons-material";
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Box } from "@mui/system";

ModuleRegistry.registerModules([
  AdvancedFilterModule,
  CsvExportModule,
  RowSelectionModule,
  TextFilterModule,
  PinnedRowModule,
  CellStyleModule ,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  FiltersToolPanelModule,
  SetFilterModule,
  RowGroupingModule,
  NumberFilterModule,
  PaginationModule ,
  QuickFilterModule,
  ValidationModule /* Development Only */,
]);

// Import the necessary AG-Grid modules
//import { ClientSideRowModelModule } from 'ag-grid-community';

// Define the types for your data
export interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
}

export function TableAgGrid(): React.JSX.Element {
  const [rows, setRows] = useState(rowdata);
  const [cols, setCols] = useState(columndefinitions);

  const [advFilterEnabled, setAdvFilterEnabled] = useState(false); 
  const [filterEnabled, setFilterEnabled] = useState(false); 

  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      enableRowGroup: true,
      enableValue: true,
      filter: true,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);


  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);


    const toggleAdvancedFilter = () => {
      setAdvFilterEnabled(!advFilterEnabled);
    };

    const toggleFilter = () => {
      setFilterEnabled(!filterEnabled);
    };


    const onFilterTextBoxChanged = useCallback(() => {
      gridRef.current!.api.setGridOption(
        "quickFilterText",
        (document.getElementById("filter-text-box") as HTMLInputElement).value,
      );
    }, []);
  
 
    const quickFilterParser = useCallback((quickFilter: string) => {
      const quickFilterParts = [];
      let lastSpaceIndex = -1;
      const isQuote = (index: number) => quickFilter[index] === '"';
      const getQuickFilterPart = (
        lastSpaceIndex: number,
        currentIndex: number,
      ) => {
        const startsWithQuote = isQuote(lastSpaceIndex + 1);
        const endsWithQuote = isQuote(currentIndex - 1);
        const startIndex =
          startsWithQuote && endsWithQuote
            ? lastSpaceIndex + 2
            : lastSpaceIndex + 1;
        const endIndex =
          startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
        return quickFilter.slice(startIndex, endIndex);
      };
      for (let i = 0; i < quickFilter.length; i++) {
        const char = quickFilter[i];
        if (char === " ") {
          if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
            quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
            lastSpaceIndex = i;
          }
        }
      }
      if (lastSpaceIndex !== quickFilter.length - 1) {
        quickFilterParts.push(
          getQuickFilterPart(lastSpaceIndex, quickFilter.length),
        );
      }
      return quickFilterParts;
    }, []);
  
    const quickFilterMatcher = useCallback(
      (quickFilterParts: string[], rowQuickFilterAggregateText: string) => {
        let result: boolean;
        try {
          result = quickFilterParts.every((part) =>
            rowQuickFilterAggregateText.match(part),
          );
        } catch {
          result = false;
        }
        return result;
      },
      [],
    );
  
    const onBtnExport = useCallback(() => {
      gridRef.current!.api.exportDataAsCsv();
    }, []);
    
  

/*     const onPdfExport = () => {
      if (gridRef.current) {
        gridRef.current!.api.exportDataAsPdf({
          // You can pass options here to customize the PDF
          columnWidth: 150,
          pageSize: 'A4',
          fileName: 'grid-export.pdf',
          // More customization options (page margins, PDF orientation, etc.) can be added here
        });
      }
    };
 */
    const [editEnabled, setEditEnabled] = useState(true); 
    const [data_id, setData_id] = useState(); 
    
 // Handle row selection change
 const onSelectionChanged = () => {
    const selectedRows = gridRef.current!.api.getSelectedRows();
  // Disable the Edit button if more than one row is selected
  setEditEnabled(selectedRows.length !== 1);

  if (selectedRows.length === 1) {
    const selectedRowId = selectedRows[0].id;
    console.log("Selected row ID:", selectedRowId);
    setData_id(selectedRowId);
  }else
  {
    setData_id(undefined);
  } 

};

  return (
 <Box
 sx={{
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center',
   alignItems: 'center',
   padding: 4,
   backgroundColor: '#f4f4f4',
   borderRadius: 2,
   boxShadow: 2,
   minWidth: 'calc(100vw - 250px)',
   margin: 'auto',
   minHeight: 'calc(100vh - 60px)', // Adjust for header height
 }}
>
    <Stack direction="row" >
      <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Users</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button color="inherit" startIcon={<Upload /* fontSize="var(--icon-fontSize-md)" */ />}>
            Import
          </Button>
          <Button color="inherit" onClick={onBtnExport} startIcon={<Download /* fontSize="var(--icon-fontSize-md)" */ />}>
            Export
          </Button>
          <Button color="inherit" onClick={toggleAdvancedFilter} startIcon={<Search /* fontSize="var(--icon-fontSize-md)" */ />}>
          Advanced Filter
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} height={1} sx={{ alignItems: 'right' }}>
          <Button  startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Edit
          </Button>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Cancel
          </Button>
        </Stack>
    </Stack>

      </Stack>
    <Stack>
      <div>
      <Card sx={{ p: 2 , spacing: 3}}>
      <OutlinedInput
        id="filter-text-box"
        defaultValue=""
        fullWidth
        placeholder="Quick Filter..."
        onInput={onFilterTextBoxChanged}
        startAdornment={
          <InputAdornment position="start">
            <Search /* fontSize="var(--icon-fontSize-md)" */ />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
    </div>
      <div id="myGrid" style={gridStyle}>
        <AgGridReact
          columnDefs={cols}
          rowData={rows}
          ref={gridRef}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          domLayout="autoHeight" // Automatically adjust grid height
          pagination={true}
          paginationPageSize={5} // Pagination page size
          paginationPageSizeSelector={[5, 10, 20, 50]}
          enableAdvancedFilter={advFilterEnabled}
          sideBar={true}
          cacheQuickFilter={true}
          quickFilterParser={quickFilterParser}
          quickFilterMatcher={quickFilterMatcher}
          onSelectionChanged={onSelectionChanged} 
         //modules={[ClientSideRowModelModule]} // Import the necessary module here
        />
      </div>
    </Stack>
 </Box>
  );
};
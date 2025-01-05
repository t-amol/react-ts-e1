import { useState } from "react";
import { Stack } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { JsonForms } from '@jsonforms/react';
import schema from './schema.json';
import uischema from './uischema.json';
import userdata from './data.json';

import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';

//import { i } from "react-router/dist/development/route-data-aSUFWnQ6";

export function FormJson(): React.JSX.Element {
  const [data, setData] = useState(userdata);
  
  
 // Handle form changes
 const handleChange = (updatedData: any) => {
  setData(updatedData);
};

// Handle Save action (for example, saving to an API or localStorage)
const handleSave = () => {
  console.log('Saved data:', data);
  // Add logic to save data, such as making an API call or updating localStorage.
};

// Handle Cancel action (reset form data to initial state)
const handleCancel = () => {
  console.log('Cancel button clicked:', userdata);
  setData(userdata);
};

    return (

      <Stack spacing={3}  width="100%">
          <Typography variant="h4">Create User</Typography>
        <div>
        <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => setData(data)}
      />
        </div>
        <Stack direction="row" spacing={0.5} height={0.5} sx={{ alignItems: 'center' }}>
          <Button  onClick={handleSave} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Save
          </Button>
          <Button onClick={handleCancel} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Cancel
          </Button>
        </Stack>
  </Stack>

    );
  };
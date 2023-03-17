import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate({ color, width, height }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress
        style={{ color: color, width: width, height: height }}
      />
    </Box>
  );
}

import React, { useState } from 'react';
import './Card.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Card = ({setExtractField}) => {
  const [other, setOther] = useState("")

  return(
    <div class="main-container">
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '90%' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic" 
          value={other}
          placeholder ="companies, universities, titles, etc."
          onChange={(event) => {
            setOther(event.target.value);
            setExtractField(event.target.value)
          }} 
          label="What to extract?" 
          variant="standard" 
        />
      </Box>
    </div>
  )
}

export default Card
import React, { useState } from 'react';
import './Card.css';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import {InputLabel} from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Card = ({setExtractField}) => {
  const [checked, setChecked] = useState("company")
  const [other, setOther] = useState("")

  return(
    <div class="main-container">
      <br></br>
      <InputLabel size="normal" focused>Please type what kind of lists you want to extract. </InputLabel>
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
          setChecked(event.target.value);
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
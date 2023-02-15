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
      <InputLabel size="normal" focused>Please select what kind of lists you want to extract. </InputLabel>
      <div class="cards">
        <div class="card card-1" onClick={() => {
          setChecked('company')
          setExtractField('company')
          setOther('company')
        }}>
          <div class="card__icon"><Checkbox {...label} defaultChecked checked={checked=='company'?true:false} style = {{marginTop:'-68px', marginLeft: '-18px'}}/></div>
          <p class="card__exit"><i class="fas fa-times"></i></p>
          <h2 class="card__title">Company</h2>
          <p class="card__apply">
            <a class="card__link" href="#">Extract name of the company from the text <i class="fas fa-arrow-right"></i></a>
          </p>
        </div>
        <div class="card card-3" onClick={() => {
          setChecked('software')
          setExtractField('software')
          setOther('software')
        }}>
          <div class="card__icon"><Checkbox {...label} defaultChecked checked={checked=='software'?true:false} color="secondary" style = {{marginTop:'-68px', marginLeft: '-18px'}}/></div>
          <p class="card__exit"><i class="fas fa-times"></i></p>
          <h2 class="card__title">Software</h2>
          <p class="card__apply">
            <a class="card__link" href="#">Extract name of the software from the text <i class="fas fa-arrow-right"></i></a>
          </p>
        </div>
      </div>
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
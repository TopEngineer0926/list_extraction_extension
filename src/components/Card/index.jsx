import React, { useState } from 'react';
import './Card.css';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Card = ({setExtractField}) => {
  const [checked, setChecked] = useState("company")

  return(
    <div class="main-container">
      <div class="cards">
        <div class="card card-1" onClick={() => {
          setChecked('company')
          setExtractField('company')
        }}>
          <div class="card__icon"><Checkbox {...label} defaultChecked checked={checked=='company'?true:false}/></div>
          <p class="card__exit"><i class="fas fa-times"></i></p>
          <h2 class="card__title">Company</h2>
          <p class="card__apply">
            <a class="card__link" href="#">Extract name of the company from the text <i class="fas fa-arrow-right"></i></a>
          </p>
        </div>
        <div class="card card-3" onClick={() => {
          setChecked('software')
          setExtractField('software')
        }}>
          <div class="card__icon"><Checkbox {...label} defaultChecked checked={checked=='software'?true:false} color="secondary" /></div>
          <p class="card__exit"><i class="fas fa-times"></i></p>
          <h2 class="card__title">Software</h2>
          <p class="card__apply">
            <a class="card__link" href="#">Extract name of the software from the text <i class="fas fa-arrow-right"></i></a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card
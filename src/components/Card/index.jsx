import React, { useState } from 'react';
import './Card.css';
import { Box, TextField, FormLabel } from '@mui/material';

const Card = ({ setCategory, handleClickGetText, setInvalidRequired }) => {
  const [other, setOther] = useState('');

  return (
    <div class='main-container'>
      <Box
        sx={{
          '& > :not(style)': { m: 1, width: '96%' },
        }}
      >
        <TextField
          required
          id='standard-basic'
          value={other}
          placeholder='companies, universities, titles, etc.'
          onChange={(event) => {
            setOther(event.target.value);
            setCategory(event.target.value);
            setInvalidRequired(false);
          }}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              handleClickGetText();
            }
          }}
          label='What to extract?'
          variant='standard'
        />
      </Box>
    </div>
  );
};

export default Card;

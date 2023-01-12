/*global chrome*/
import './App.css';
import { useEffect, useState } from 'react';
import {
  Box,
  ListItem,
  Button,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';

const ListItemPanel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    background: '#eeeeee',
  },
});
export default function App() {
  const [capturedText, setCapturedText] = useState('');
  const [listData, setListData] = useState([
    'LeewayHertz',
    'Intellectsoft',
    'Blockchain Intelligence Group',
    'Markovate',
    'ChromaWay',
    'Altoros',
    'Deqode',
    'Primechain',
    'Suffescom Solutions Inc',
    'Accubits',
    'JatApp',
    'SheerChain',
    'Espeo',
    '4ire Labs',
    'Venture Aviator',
    'Sparkbit',
    'Software Mill',
    'InfoPulse',
    'Unicsoft',
    'Axioma',
    'Aeries Blockchain Corporation',
    'Titanium Blockchain',
  ]);
  const [tempListData, setTempListData] = useState([]);

  useEffect(() => {
    setTempListData(listData);
  }, [listData]);

  const handleClickGetText = () => {
    chrome.tabs.executeScript(null, {
      code: 'console.log(document.documentElement.innerText);',
    });
    setCapturedText(document.documentElement.innerText);
  };

  const handleClickDiscard = () => {
    setCapturedText('');
    setTempListData(listData);
  };

  const handleClickSave = () => {};

  const handleClickAdd = (index) => {
    let _tmpListData = [...tempListData];
    _tmpListData.splice(index, 0, '');
    setTempListData(_tmpListData);
  };

  const handleClickRemove = (index) => {
    let _tmpListData = [...tempListData];
    _tmpListData.splice(index, 1);
    setTempListData(_tmpListData);
  };

  const handleChangeItemData = (e, index) => {
    setTempListData(
      tempListData.map((tempData, i) => {
        if (i === index) {
          return e.target.value;
        }
        return tempData;
      })
    );
  };

  const handleClickMoveUp = (index) => {
    let selected = tempListData[index - 1];

    setTempListData(
      tempListData.map((tempData, i) => {
        if (i === index - 1) {
          return tempListData[index];
        } else if (i === index) {
          return selected;
        }
        return tempData;
      })
    );
  };

  const handleClickMoveDown = (index) => {
    let selected = tempListData[index];

    setTempListData(
      tempListData.map((tempData, i) => {
        if (i === index) {
          return tempListData[i + 1];
        } else if (i === index + 1) {
          return selected;
        }
        return tempData;
      })
    );
  };

  return capturedText.length === 0 ? (
    <Button variant="contained" onClick={handleClickGetText}>
      Get Captured Text
    </Button>
  ) : (
    <Box
      sx={{
        width: '100%',
        height: 400,
        maxWidth: 360,
        bgcolor: 'background.paper',
        margin: '20px',
        gap: '20px',
        display: 'grid',
      }}
    >
      <Box
        sx={{
          height: 400,
          width: 360,
          overflowY: 'scroll',
          border: '1px solid grey',
        }}
      >
        {tempListData.map((tempData, index) => (
          <ListItem key={index} component="div" disablePadding>
            <ListItemPanel>
              <Typography style={{ padding: 10 }}>{index + 1}</Typography>
              <IconButton
                onClick={() => handleClickMoveUp(index)}
                disabled={index === 0}
              >
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton
                onClick={() => handleClickMoveDown(index)}
                disabled={index === tempListData.length - 1}
              >
                <ArrowDownwardIcon />
              </IconButton>
              <TextField
                margin="dense"
                id="name"
                multiline
                variant="outlined"
                value={tempData}
                onChange={(e) => handleChangeItemData(e, index)}
              />
              <IconButton onClick={() => handleClickRemove(index)}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={() => handleClickAdd(index)}>
                <AddIcon />
              </IconButton>
            </ListItemPanel>
          </ListItem>
        ))}
      </Box>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button variant="contained" onClick={handleClickDiscard}>
          Discard
        </Button>
        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
      </div>
    </Box>
  );
}

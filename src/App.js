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
import axios from 'axios';

const ListItemPanel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  ':hover': {
    background: '#eeeeee',
  },
});

const ActionButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
});

const TitilePanel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
});

const TextCaptureButton = styled(Button)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const API_ENDPOINT = 'https://moonhub-list-backend.herokuapp.com/api';

export default function App() {
  const [capturedText, setCapturedText] = useState('');
  const [title, setTitle] = useState('');
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
    function modifyDOM() {
      //You can play with your DOM here or check URL against your regex
      console.log('Tab script:');
      console.log(document.documentElement.innerText);
      return document.documentElement.innerText;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript(
      {
        code: '(' + modifyDOM + ')();', //argument here is a string but function.toString() returns function's code
      },
      (results) => {
        //Here we have just the innerHTML and not DOM structure
        console.log('Popup script:');
        console.log(results[0]);
        setCapturedText(results[0]);
      }
    );
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

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    if (capturedText) {
      fetchListData();
    }
  }, [capturedText]);

  const fetchListData = async () => {
    let result = await axios.get(
      `${API_ENDPOINT}?list_text=${encodeURIComponent(capturedText)}`
    ).data;

    console.log('====', result);
    setListData(result.list);
  };
  return capturedText.length === 0 ? (
    <TextCaptureButton variant="contained" onClick={handleClickGetText}>
      Get Captured Text
    </TextCaptureButton>
  ) : (
    <Box
      sx={{
        width: '100%',
        height: 400,
        maxWidth: 600,
        bgcolor: 'background.paper',
        margin: '20px',
        gap: '20px',
        display: 'grid',
      }}
    >
      <TitilePanel>
        Name:{' '}
        <TextField
          margin="dense"
          id="name"
          multiline
          fullWidth
          variant="outlined"
          value={title}
          onChange={handleChangeTitle}
        />
      </TitilePanel>
      <Box
        sx={{
          height: 400,
          width: 590,
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
                style={{ width: '360px' }}
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
      <ActionButtonGroup>
        <Button variant="contained" onClick={handleClickDiscard}>
          Discard
        </Button>
        <Button variant="contained" onClick={handleClickSave}>
          Save
        </Button>
      </ActionButtonGroup>
    </Box>
  );
}

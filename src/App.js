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
import CircularIndeterminate from './components/CircularIndeterminate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

const LoadingPanel = styled(Box)(({ loading }) => ({
  display: !loading ? 'none' : 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%',
}));

const API_ENDPOINT =
  'https://list-extraction-backend-d44ypzkuba-uc.a.run.app/api';

export default function App() {
  const [capturedText, setCapturedText] = useState('');
  const [title, setTitle] = useState('');
  const [listData, setListData] = useState([]);
  const [tempListData, setTempListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  useEffect(() => {
    setTempListData(listData);
  }, [listData]);

  const handleClickGetText = () => {
    function modifyDOM() {
      //You can play with your DOM here or check URL against your regex
      return document.documentElement.innerText;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript(
      {
        code: '(' + modifyDOM + ')();', //argument here is a string but function.toString() returns function's code
      },
      (results) => {
        //Here we have just the innerHTML and not DOM structure
        setCapturedText(results[0]);
      }
    );
  };

  const handleClickDiscard = () => {
    setCapturedText('');
    setTempListData(listData);
  };

  const handleClickSave = () => {
    setIsSaveClicked(true);
    setTimeout(() => window.close(), 750);
  };

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
    setIsLoading(true);
    axios
      .post(`${API_ENDPOINT}?list_text=${encodeURIComponent(capturedText)}`)
      .then((res) => {
        const data = res.data;
        setListData(data.list);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return capturedText.length === 0 || isLoading ? (
    <>
      <TextCaptureButton variant="contained" onClick={handleClickGetText}>
        Get Captured Text
      </TextCaptureButton>
      <LoadingPanel loading={isLoading ? isLoading : undefined}>
        <CircularIndeterminate />
        <Typography variant="">Extracting List...</Typography>
      </LoadingPanel>
    </>
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
          {isSaveClicked ? <CheckCircleOutlineIcon /> : 'Save'}
        </Button>
      </ActionButtonGroup>
    </Box>
  );
}

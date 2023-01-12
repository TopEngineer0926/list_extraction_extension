/*global chrome*/
import './App.css';
import { useEffect, useState } from 'react';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

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
    // chrome.tabs.executeScript(null, {
    //   code: 'console.log(document.documentElement.innerText);',
    // });
    setCapturedText(document.documentElement.innerText);
  };

  const handleClickDiscard = () => {
    setCapturedText('');
    setTempListData(listData);
  };

  const handleClickSave = () => {};

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
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={200}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
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

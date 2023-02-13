/*global chrome*/
import './App.css';
import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import {
  DeleteOutlineOutlined,
  DragIndicator,
  Add,
  CheckCircleOutline,
} from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import CircularIndeterminate from './components/CircularIndeterminate';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ActionButtonGroup = styled('div')({
  width: '592px',
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  marginBottom: '10px',
});

const TitilePanel = styled('div')({
  width: '592px',
  display: 'flex',
  flexDirection: 'column',
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
  height: '98%',
}));

// const API_ENDPOINT =
// 'https://list-extraction-backend-d44ypzkuba-uc.a.run.app/api';

const API_ENDPOINT = 'http://localhost:8000/api';

export default function App() {
  const [capturedText, setCapturedText] = useState('');
  const [title, setTitle] = useState('');
  const [listData, setListData] = useState([]);
  const [id, setId] = useState('');
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
    // setIsSaveClicked(true);
    // setTimeout(() => window.close(), 750);

    setIsLoading(true);

    let data = {
      return_data: listData,
      title: title,
    };

    axios
      .put(`${API_ENDPOINT}/list_text/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        const data = res.data;

        setListData(data.return_data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    let _tmpListData = tempListData.map((tempData, i) => {
      if (i === index) {
        return e.target.value;
      }
      return tempData;
    });

    setTempListData(_tmpListData);
  };

  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...tempListData];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setTempListData(updatedList);
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

    let data = {
      request: capturedText,
      title: title,
    };

    axios
      .post(`${API_ENDPOINT}/list_text`, data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        const data = res.data;
        setListData(data.result);
        setId(data.id);
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
      <TextCaptureButton
        variant="contained"
        onClick={handleClickGetText}
        style={{ background: '#5f2ee5' }}
      >
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
        Name
        <TextField
          margin="dense"
          id="name"
          multiline
          fullWidth
          size="small"
          variant="outlined"
          value={title}
          onChange={handleChangeTitle}
        />
      </TitilePanel>
      <Box
        sx={{
          borderRadius: '4px',
          height: 400,
          width: 590,
          overflowY: 'scroll',
          border: '1px solid grey',
        }}
      >
        <DragDropContext onDragEnd={handleDrop}>
          <Droppable droppableId="list-container">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tempListData.map((tempData, index) => {
                  return (
                    <>
                      <Draggable
                        key={tempData}
                        draggableId={tempData}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <div
                              style={{ display: 'flex', flexDirection: 'row' }}
                            >
                              <div
                                style={{ background: '#f9fafb', width: '35px' }}
                              >
                                <DragIndicator
                                  style={{
                                    marginLeft: '5px',
                                    marginTop: '15px',
                                    background: '#f9fafb',
                                    color: '#89888e',
                                  }}
                                />
                              </div>
                              <Typography
                                style={{
                                  padding: '15px 8px 0px 5px',
                                  width: '20px',
                                }}
                              >
                                {index + 1}.
                              </Typography>
                              <TextField
                                margin="dense"
                                id="name"
                                multiline
                                size="small"
                                variant="outlined"
                                value={tempData}
                                style={{
                                  width: '450px',
                                  background: '#f9fafb',
                                }}
                                onChange={(e) => handleChangeItemData(e, index)}
                              />
                              <IconButton
                                onClick={() => handleClickRemove(index)}
                              >
                                <DeleteOutlineOutlined
                                  style={{ color: '#eb6363' }}
                                />
                              </IconButton>
                              <IconButton onClick={() => handleClickAdd(index)}>
                                <Add />
                              </IconButton>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    </>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      <ActionButtonGroup>
        <Button
          variant="contained"
          onClick={handleClickDiscard}
          style={{ marginRight: '10px', color: '#5f2ee5', background: 'white' }}
        >
          Discard
        </Button>
        <Button
          variant="contained"
          onClick={handleClickSave}
          style={{ background: '#5f2ee5' }}
        >
          {isSaveClicked ? <CheckCircleOutline /> : 'Save'}
        </Button>
      </ActionButtonGroup>
    </Box>
  );
}

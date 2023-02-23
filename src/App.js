/*global chrome*/
import './App.css';
import { useEffect, useState } from 'react';
import { goBack, goTo, Router } from 'react-chrome-extension-router';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  FormLabel,
} from '@mui/material';
import {
  DeleteOutlineOutlined,
  DragIndicator,
  Add,
  CheckCircleOutline,
} from '@mui/icons-material';
import axios from 'axios';
import CircularIndeterminate from './components/CircularIndeterminate';
import Card from './components/Card';
import ActionButtonGroup from './components/ActionButtonGroup';
import LoadingPanel from './components/LoadingPanel';
import TextCaptureButton from './components/TextCaptureButton';
import TitlePanel from './components/TitlePanel';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const API_ENDPOINT = 'https://moonhub-list-backend.herokuapp.com/api';
const API_ENDPOINT = 'https://moonhub-list-backend-develop.herokuapp.com/api';

// const API_ENDPOINT = 'http://localhost:8000/api';

const ServerError = () => {
  return (
    <div style={{ margin: '8px' }}>
      <p>
        <h1>Oops!</h1>
      </p>
      <p>
        <h2>Can't get the list data. Please try again.</h2>
      </p>
    </div>
  );
};

export default function App() {
  const [capturedText, setCapturedText] = useState('');
  const [title, setTitle] = useState('');
  const [listData, setListData] = useState([]);
  const [id, setId] = useState('');
  const [tempListData, setTempListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [activeInput, setActiveInput] = useState();
  const [category, setCategory] = useState('');
  const [invalidRequired, setInvalidRequired] = useState(false);
  const [url, setUrl] = useState('');
  const [listLog, setListLog] = useState([]);

  useEffect(() => {
    setTempListData(listData);
  }, [listData]);

  const handleClickGetText = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let url = tabs[0].url;
      setUrl(url);
      // use `url` here inside the callback because it's asynchronous!
    });
    if (category.trim() === '') {
      setInvalidRequired(true);
    } else {
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
    }
  };

  const handleClickDiscard = () => {
    const data = {
      category: category,
      listData: listData,
    };
    let flag = 1;
    listLog.map((item, index) => {
      if (item.category && item.category === category) {
        flag = 0;
      }
    });
    if (flag === 1) {
      let _tmpListLog = [...listLog];
      _tmpListLog.push(data);
      setListLog(_tmpListLog);
    }
    setCapturedText('');
    setCategory('');
    setTempListData(listData);
  };

  const handleClickSave = () => {
    setIsLoading(true);
    setCategory('');
    setListData(tempListData);

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
        setTempListData(listData);
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
    setActiveInput(index);

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

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let currentUrl = tabs[0].url;
      setUrl(currentUrl);
      // use `url` here inside the callback because it's asynchronous!
      let data = {
        request: capturedText,
        title: title,
        category: category,
        url: url,
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
          let flag = 0;
          listLog.map((item) => {
            if (item.category && item.category === category) {
              flag = 1;
              setListData(item.listData);
            }
          });
          if (flag === 0) {
            goTo(ServerError);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  return capturedText.length === 0 || isLoading ? (
    <Router>
      <div style={{ width: '642px' }}>
        <div style={{ display: isLoading ? 'none' : 'block' }}>
          <Card
            setCategory={setCategory}
            handleClickGetText={handleClickGetText}
            setInvalidRequired={setInvalidRequired}
          />
          <FormLabel
            color='error'
            error={true}
            style={{
              display: invalidRequired ? 'block' : 'none',
              marginLeft: '38px',
            }}
          >
            Please type what you want to extract...
          </FormLabel>
        </div>
        <TextCaptureButton
          variant='contained'
          onClick={handleClickGetText}
          style={{
            background: '#5f2ee5',
            width: '32%',
            margin: 'auto',
            marginTop: '20px',
          }}
        >
          Extract List
        </TextCaptureButton>
        <LoadingPanel
          loading={isLoading ? isLoading : undefined}
          style={{ marginTop: '226px' }}
        >
          <CircularIndeterminate />
          <Typography variant=''>Extracting {category} List...</Typography>
        </LoadingPanel>
      </div>
    </Router>
  ) : (
    <Router>
      <Box
        sx={{
          width: '100%',
          height: 400,
          maxWidth: 600,
          bgColor: 'background.paper',
          margin: '20px',
          gap: '20px',
          display: 'grid',
        }}
      >
        <TitlePanel>
          <TextField
            required
            id='outlined-required'
            value={title}
            onChange={handleChangeTitle}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                handleChangeTitle();
              }
            }}
            label='Name'
            variant='standard'
          />
        </TitlePanel>
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
            <Droppable droppableId='list-container'>
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
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                }}
                              >
                                <div
                                  style={{
                                    background: '#f9fafb',
                                    width: '35px',
                                  }}
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
                                  margin='dense'
                                  id='name'
                                  multiline
                                  size='small'
                                  variant='outlined'
                                  value={tempData}
                                  style={{
                                    width: '450px',
                                    background: '#f9fafb',
                                  }}
                                  onChange={(e) =>
                                    handleChangeItemData(e, index)
                                  }
                                  inputRef={(input) => {
                                    if (activeInput === index)
                                      input && input.focus();
                                  }}
                                  onFocus={(e) => {
                                    if (activeInput === index) {
                                      e.currentTarget.setSelectionRange(
                                        e.currentTarget.value.length,
                                        e.currentTarget.value.length
                                      );
                                      setActiveInput(null);
                                    }
                                  }}
                                />
                                <IconButton
                                  onClick={() => handleClickRemove(index)}
                                >
                                  <DeleteOutlineOutlined
                                    style={{ color: '#eb6363' }}
                                  />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleClickAdd(index)}
                                >
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
            variant='contained'
            onClick={handleClickDiscard}
            style={{
              marginRight: '10px',
              color: '#5f2ee5',
              background: 'white',
            }}
          >
            Discard
          </Button>
          <Button
            variant='contained'
            onClick={handleClickSave}
            style={{ background: '#5f2ee5' }}
          >
            {isSaveClicked ? <CheckCircleOutline /> : 'Save'}
          </Button>
        </ActionButtonGroup>
      </Box>
    </Router>
  );
}

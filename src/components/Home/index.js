/*global chrome*/
import "./Home.css";
import { useEffect, useState } from "react";
import { goBack, goTo, Router } from "react-chrome-extension-router";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  FormLabel,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  DeleteOutlineOutlined,
  DragIndicator,
  Add,
  CheckCircleOutline,
} from "@mui/icons-material";
import axios from "axios";
import CircularIndeterminate from "../CircularIndeterminate";
import Card from "../Card";
import ActionButtonGroup from "../ActionButtonGroup";
import LoadingPanel from "../LoadingPanel";
import TextCaptureButton from "../TextCaptureButton";
import TitlePanel from "../TitlePanel";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getLoggedIn,
  getUserInfo,
  removeAuthorizationUserInfo,
} from "../../utils";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// const API_ENDPOINT = 'https://list-extraction-backend-prod-ggwnhuypbq-uc.a.run.app/api';
const API_ENDPOINT =
  "https://list-extraction-backend-dev-ggwnhuypbq-uc.a.run.app/api";

// const API_ENDPOINT = 'http://192.168.105.55:8000/api';

const MOONHUB_SEARCH_ENDPOINT = "http://35.238.228.19:8080";

const ServerError = () => {
  return (
    <div style={{ margin: "8px" }}>
      <p>
        <h1>Oops!</h1>
      </p>
      <p>
        <h2>Can't get the list data. Please try again.</h2>
      </p>
    </div>
  );
};

const Home = () => {
  const [capturedText, setCapturedText] = useState("");
  const [title, setTitle] = useState("");
  const [listData, setListData] = useState([]);
  const [id, setId] = useState("");
  const [tempListData, setTempListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [activeInput, setActiveInput] = useState();
  const [category, setCategory] = useState("");
  const [invalidRequired, setInvalidRequired] = useState(false);
  const [url, setUrl] = useState("");
  const [listLog, setListLog] = useState([]);
  const [capturedTextForItems, setCapturedTextForItems] = useState("");
  const [btnLoading, setBtnLoading] = useState({
    saveBtn: false,
    importBtn: false,
    copyListBtn: false,
    downloadListBtn: false,
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    user_id: "",
    user_email: "",
    auth_token: "",
  });

  const filterTypes = [
    "position",
    "city",
    "university",
    "degree",
    "major",
    "company",
    "title",
  ];
  const [filterType, setFilterType] = useState("");
  const [developerMode, setDeveloperMode] = useState(false);

  const handleChangeFilterType = (event) => {
    setFilterType(event.target.value);
  };

  const navigate = useNavigate();

  let port = chrome.runtime.connect({ name: "init_list_extraction" });

  useEffect(() => {
    setTempListData(listData);
  }, [listData]);

  const handleClickGetText = () => {
    if (category.trim() === "") {
      setInvalidRequired(true);
    } else {
      port.postMessage({ type: "get-user-data" });
      port.onMessage.addListener(function (msg) {
        setCapturedText(msg.result);
        setUrl(msg.url);
      });
      // setCapturedText("Google, Apple, AWS, Facebook");
    }
  };

  const getCapturedText = () => {
    port.postMessage({ type: "get-user-data" });
    port.onMessage.addListener(function (msg) {
      setCapturedTextForItems(msg.result);
      setUrl(msg.url);
    });
  };

  const handleClickDiscard = () => {
    setTempListData(listData);
  };

  const handleClickSave = (type) => {
    setIsLoading(true);
    setListData(tempListData);

    let user = JSON.parse(getUserInfo());
    let data = {
      url: url,
      category: category,
      dev_mode: developerMode,
      title: title,
      filter: filterType,
      user_id: loggedIn ? user.user_id : "",
      user_email: loggedIn ? user.user_email : "",
      return_data: tempListData,
    };

    setBtnLoading({
      ...btnLoading,
      [type]: true,
    });

    axios
      .put(`${API_ENDPOINT}/list_text/${id}`, data, {
        headers: { "Content-Type": "application/json" },
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
        setBtnLoading({
          ...btnLoading,
          [type]: false,
        });
      });
  };

  const handleClickCopyList = (type) => {
    setBtnLoading({
      ...btnLoading,
      [type]: true,
    });

    setTimeout(() => {
      let copiedText = JSON.stringify(tempListData);
      navigator.clipboard.writeText(copiedText).then(function () {
        toast.success("List data copied to clipboard successfully!");
      });

      setBtnLoading({
        ...btnLoading,
        [type]: false,
      });
    }, 1000);
  };

  const handleClickImport = (type) => {
    let user = JSON.parse(getUserInfo());
    let data = {
      user_id: user.user_id,
      name: title,
      type: "string",
      mainType: filterType,
      filter: {
        label: title,
        list: listData.map((data) => {
          return {
            name: data,
            enabled: true,
            include: true,
          };
        }),
        include: true,
        mix: false,
      },
    };

    setBtnLoading({
      ...btnLoading,
      [type]: true,
    });

    axios
      .post(`${MOONHUB_SEARCH_ENDPOINT}/lists/`, data, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((res) => {
        toast.success("List imported to search successfully");
      })
      .catch((e) => {
        const message = e?.response?.data?.detail;
        toast.error(message ? message : "List imported to search failed");
      })
      .finally(() => {
        setBtnLoading({
          ...btnLoading,
          [type]: false,
        });
      });
  };

  const handleClickAdd = (index) => {
    let _tmpListData = [...tempListData];
    _tmpListData.splice(index, 0, "");
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
      fetchListData(capturedText);
    }
  }, [capturedText]);

  useEffect(() => {
    if (capturedTextForItems) {
      fetchListData(capturedTextForItems);
    }
  }, [capturedTextForItems]);

  const fetchListData = (requestData) => {
    setIsLoading(true);

    let user = JSON.parse(getUserInfo());
    let body = {
      request: requestData,
      title: title,
      category: category,
      url: url,
      user_id: loggedIn ? user.user_id : "",
      user_email: loggedIn ? user.user_email : "",
    };

    axios
      .post(`${API_ENDPOINT}/list_text`, body, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const data = res.data;
        let temp = [];

        data.result &&
          data.result.map((d, index) => {
            if (tempListData.indexOf(d) < 0) {
              temp.push(d);
            }
          });

        setTempListData([...tempListData, ...temp]);
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
  };

  const handleClickAddItems = () => {
    getCapturedText();
  };

  const handleClickStartOver = () => {
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
    setCapturedText("");
    setCategory("");
    setTempListData(listData);
  };

  const handleClickSignOut = () => {
    removeAuthorizationUserInfo();
    navigate("/login");
  };

  const handleClickSignIn = () => {
    navigate("/login");
  };

  useEffect(() => {
    let user = JSON.parse(getUserInfo());
    let logged_in = getLoggedIn();
    if (JSON.parse(logged_in)) {
      setLoggedIn(true);
      setUserInfo({
        user_id: user.user_id,
        user_email: user.user_email,
        auth_token: user.auth_token,
      });
    }
  }, []);

  const handleChangeDeveloperMode = (e) => {
    setDeveloperMode(e.target.checked);
  };

  const handleClickDownloadList = (type) => {
    setBtnLoading({
      ...btnLoading,
      [type]: true,
    });

    setTimeout(() => {
      var content = tempListData.join("\n");

      var downloadLink = document.createElement("a");
      downloadLink.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content)
      );
      downloadLink.setAttribute("download", `${title}.txt`);
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setBtnLoading({
        ...btnLoading,
        [type]: false,
      });
    }, 1000);
  };

  return (
    <>
      {capturedText.length === 0 || isLoading ? (
        <Router>
          {loggedIn ? (
            <div style={{ margin: 25, gap: 20, display: "grid" }}>
              <div style={{ textAlign: "center", fontSize: 20 }}>
                You are logged in to Moonhub Search as:
              </div>
              <div
                style={{ textAlign: "center", fontSize: 20, color: "#5f2ee5" }}
              >
                {userInfo.user_email}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  style={{
                    color: "grey",
                    borderColor: "#e8e8e8",
                    textTransform: "none",
                  }}
                  onClick={handleClickSignOut}
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ margin: 25, gap: 20, display: "grid" }}>
              <div style={{ textAlign: "center", fontSize: 20 }}>
                Login to Moonhub Search first to import lists directly!
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    background: "#5f2ee5",
                    textTransform: "none",
                  }}
                  onClick={handleClickSignIn}
                >
                  Login to Moonhub Search
                </Button>
              </div>
            </div>
          )}
          <div>
            <div style={{ display: isLoading ? "none" : "block" }}>
              <Card
                setCategory={setCategory}
                handleClickGetText={handleClickGetText}
                setInvalidRequired={setInvalidRequired}
              />
              <FormLabel
                color="error"
                error={true}
                style={{
                  display: invalidRequired ? "block" : "none",
                  marginLeft: "38px",
                }}
              >
                Please type what you want to extract...
              </FormLabel>
            </div>
            <TextCaptureButton
              variant="contained"
              onClick={handleClickGetText}
              style={{
                background: "#5f2ee5",
                width: "32%",
                margin: "auto",
                marginTop: "20px",
              }}
            >
              Extract List
            </TextCaptureButton>
            <LoadingPanel
              loading={isLoading ? isLoading : undefined}
              style={{ marginTop: "226px" }}
            >
              <CircularIndeterminate color={"#5f2ee5"} width={40} height={40} />
              <Typography variant="">Extracting {category} List...</Typography>
            </LoadingPanel>
          </div>
          <FormGroup sx={{ position: "fixed", bottom: 0, margin: "25px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={developerMode}
                  onChange={handleChangeDeveloperMode}
                  sx={{
                    color: "#5f2ee5",
                    "&.Mui-checked": {
                      color: "#5f2ee5",
                    },
                  }}
                />
              }
              label="Developer mode"
            />
          </FormGroup>
        </Router>
      ) : (
        <Router>
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              bgColor: "background.paper",
              margin: "20px",
              gap: "4px",
              display: "grid",
              justifyContent: "center",
            }}
          >
            {loggedIn ? (
              <div
                style={{ margin: 10, gap: 5, display: "grid", marginRight: 0 }}
              >
                <div
                  style={{ textAlign: "right", fontSize: 14, color: "grey" }}
                >
                  You are logged in to Moonhub Search as:
                </div>
                <div
                  style={{ textAlign: "right", fontSize: 14, color: "grey" }}
                >
                  {userInfo.user_email}
                </div>
              </div>
            ) : (
              <div
                style={{ margin: 10, gap: 5, display: "grid", marginRight: 0 }}
              >
                <Link
                  style={{ textAlign: "right", fontSize: 14, color: "grey" }}
                  to="/login"
                >
                  Login to Moonhub Search
                </Link>
              </div>
            )}
            <ActionButtonGroup>
              <Button
                variant="contained"
                onClick={handleClickStartOver}
                style={{
                  marginRight: "10px",
                  color: "#5f2ee5",
                  background: "white",
                  textTransform: "none",
                }}
              >
                Start Over
              </Button>
              <Button
                variant="contained"
                onClick={handleClickAddItems}
                style={{ background: "#5f2ee5", textTransform: "none" }}
              >
                Add Items
              </Button>
            </ActionButtonGroup>
            <TitlePanel>
              <TextField
                required
                id="outlined-required"
                value={title}
                onChange={handleChangeTitle}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    handleChangeTitle();
                  }
                }}
                style={{ background: "#f9fafb", color: "#89888e" }}
                sx={{
                  "& .MuiInputBase-root": {
                    "& .MuiOutlinedInput-input": {
                      padding: "10px 14px",
                    },
                  },
                }}
                placeholder="Name"
                variant="outlined"
              />
            </TitlePanel>
            <TitlePanel>
              <FormControl size="small">
                <InputLabel id="demo-select-small">Filter</InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={filterType}
                  label="Filter"
                  style={{ background: "#f9fafb", color: "#89888e" }}
                  onChange={handleChangeFilterType}
                >
                  {filterTypes.map((fType, index) => (
                    <MenuItem value={fType} key={index}>
                      {fType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TitlePanel>
            <Box
              sx={{
                borderRadius: "4px",
                height: 390,
                width: 590,
                overflowY: "scroll",
                border: "1px solid grey",
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
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <div
                                      style={{
                                        background: "#f9fafb",
                                        width: "35px",
                                      }}
                                    >
                                      <DragIndicator
                                        style={{
                                          marginLeft: "5px",
                                          marginTop: "15px",
                                          background: "#f9fafb",
                                          color: "#89888e",
                                        }}
                                      />
                                    </div>
                                    <Typography
                                      style={{
                                        padding: "15px 8px 0px 5px",
                                        width: "20px",
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
                                        width: "450px",
                                        background: "#f9fafb",
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
                                        style={{ color: "#eb6363" }}
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
                variant="contained"
                onClick={handleClickDiscard}
                style={{
                  color: "#5f2ee5",
                  background: "white",
                  textTransform: "none",
                }}
              >
                Discard
              </Button>
              <Button
                variant="contained"
                onClick={() => handleClickSave("saveBtn")}
                style={{ background: "#5f2ee5", textTransform: "none" }}
                endIcon={
                  btnLoading.saveBtn ? (
                    <CircularIndeterminate
                      color="white"
                      width={25}
                      height={25}
                    />
                  ) : null
                }
              >
                {isSaveClicked ? <CheckCircleOutline /> : "Save"}
              </Button>
              <Button
                variant="contained"
                onClick={() => handleClickCopyList("copyListBtn")}
                style={{ background: "#5f2ee5", textTransform: "none" }}
                endIcon={
                  btnLoading.copyListBtn ? (
                    <CircularIndeterminate
                      color="white"
                      width={25}
                      height={25}
                    />
                  ) : null
                }
              >
                Copy List
              </Button>
              <Button
                variant="contained"
                onClick={() => handleClickDownloadList("downloadListBtn")}
                style={{ background: "#5f2ee5", textTransform: "none" }}
                endIcon={
                  btnLoading.downloadListBtn ? (
                    <CircularIndeterminate
                      color="white"
                      width={25}
                      height={25}
                    />
                  ) : null
                }
              >
                Download List
              </Button>
              {loggedIn && (
                <Button
                  variant="contained"
                  onClick={() => handleClickImport("importBtn")}
                  style={{
                    background:
                      listData.length === 0 ? "rgba(0, 0, 0, 0.12)" : "#5f2ee5",
                    textTransform: "none",
                  }}
                  endIcon={
                    btnLoading.importBtn ? (
                      <CircularIndeterminate
                        color="white"
                        width={25}
                        height={25}
                      />
                    ) : null
                  }
                  disabled={listData.length === 0}
                >
                  Import to Search
                </Button>
              )}
            </ActionButtonGroup>
            {loggedIn && listData.length === 0 && (
              <div style={{ textAlign: "right", color: "red", marginTop: -5 }}>
                You must save the list before importing
              </div>
            )}
          </Box>
        </Router>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default Home;

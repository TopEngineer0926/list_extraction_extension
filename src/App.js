/*global chrome*/
import './App.css';

function App() {
  const handleClickGetText = () => {
    chrome.tabs.executeScript(null, {
      code: 'console.log(document.documentElement.innerText);',
    });
  };

  return (
    <div className="App">
      <button onClick={handleClickGetText}>Get Text</button>
    </div>
  );
}

export default App;

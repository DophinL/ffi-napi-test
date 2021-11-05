import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './App.global.css';

const Hello = () => {
  const [bridgeCount, setBridgeCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  const temp = useRef({
    messages,
  }).current;

  temp.messages = messages;

  useEffect(() => {
    window.electron.ipcRenderer.on('bridge-connect', () => {
      setBridgeCount(1);
    });

    window.electron.ipcRenderer.on('bridge-disconnect', () => {
      setBridgeCount(0);
    });

    window.electron.ipcRenderer.on('client-connect', () => {
      setClientCount((c) => c + 1);
    });

    window.electron.ipcRenderer.on('client-disconnect', () => {
      setClientCount((c) => c - 1);
    });

    window.electron.ipcRenderer.on('client-message', (message: string) => {
      const nextMessages = [message, ...temp.messages].slice(0, 30);

      setMessages(nextMessages);
    });
  }, []);

  const onClick = () => {
    window.electron.ipcRenderer.openBrowser(
      'https://pre-turing-xunxi.alibaba-inc.com/'
    );
  };

  const onClick2 = () => {
    window.electron.ipcRenderer.setBokeTop();
  };

  return (
    <div>
      <button onClick={onClick}>点我进入图灵</button>
      <button onClick={onClick2}>測試</button>
      <h2>bridge数量：{bridgeCount}</h2>
      <h2>client数量：{clientCount}</h2>
      <h2>
        消息列表({messages.length}){' '}
        <button onClick={() => setMessages([])}>清空消息</button>
      </h2>
      <div style={{ height: '400px', overflow: 'auto' }}>
        {messages.map((msg) => {
          return <p style={{ marginBottom: '20px' }}>{msg}</p>;
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userId, setUserId] = useState('');
  const [score, setScore] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [message, setMessage] = useState('');
  const [showPrizeAlert, setShowPrizeAlert] = useState(false);
  const [scoreDiff, setScoreDiff] = useState(null);

  useEffect(() => {
    const name = prompt('Enter your full name');
    if (name) {
      const trimmedId = name.toLowerCase().replace(/\s+/g, '');
      setUserId(trimmedId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3001/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setScore(data.score);
        setPrizes(data.prizes);
      });
  }, [userId]);

  const handleClick = async () => {
    if (!userId) return;

    const oldScore = score;
    const res = await fetch(`http://localhost:3001/api/user/${userId}/click`, {
      method: 'POST'
    });
    const data = await res.json();

    setScore(data.score);
    setPrizes(data.prizes);

    const diff = data.score - oldScore;
    if (diff !== 0) {
      setScoreDiff(diff > 0 ? `+${diff}` : `${diff}`);
      setTimeout(() => {
        setScoreDiff(null);
      }, 2000);
    }

    let msg = '';
    if (data.gotPoints && data.gotPrize) {
      msg = 'You got 10 extra points and a prize!';
    } else if (data.gotPoints) {
      msg = 'You got 10 extra points!';
    } else if (data.gotPrize) {
      msg = 'You won a prize!';
    }
    setMessage(msg);

    if (data.gotPrize) {
      setShowPrizeAlert(true);
      setTimeout(() => {
        setShowPrizeAlert(false);
      }, 2000);
    }
  };

  return (
    <div id="root" className="container">
      <h1>Clicker Game</h1>
      <div className="card">
        <h2>
          <span className="score-container">
            Score: {score}
            {scoreDiff && <span className="score-diff">{scoreDiff}</span>}
          </span>
        </h2>
        <h2>Prizes: {prizes}</h2>
      </div>

      <div className="message-container">
        {message && <h3 className="msg">{message}</h3>}
      </div>

      <button onClick={handleClick}>Click Me</button>

      {showPrizeAlert && (
        <div className="overlay">
          <div className="overlayContent">Congratulations! You got a prize!</div>
        </div>
      )}
    </div>
  );
}

export default App;

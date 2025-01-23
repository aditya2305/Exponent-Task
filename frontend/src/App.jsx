import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [score, setScore] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [message, setMessage] = useState('');
  const [showPrizeAlert, setShowPrizeAlert] = useState(false);
  const [scoreDiff, setScoreDiff] = useState(null);

  useEffect(() => {
    let name = prompt('Enter your full name');
    if (!name || !name.trim()) {
      name = 'Player 1';
    }
    setUsername(name.trim());

    const trimmedId = name.toLowerCase().replace(/\s+/g, '');
    setUserId(trimmedId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`https://exponentgame.duckdns.org/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setScore(data.score);
        setPrizes(data.prizes);
      })
      .catch((err) => console.error('Error fetching user:', err));
  }, [userId]);

  const capitalize = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleClick = async () => {
    if (!userId) return;

    const oldScore = score;
    try {
      const res = await fetch(`https://exponentgame.duckdns.org/api/user/${userId}/click`, {
        method: 'POST',
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
    } catch (error) {
      console.error('Error clicking:', error);
    }
  };

  return (
    <div id="root" className="container">
      <h1>Clicker Game</h1>
      <h2>Welcome, {capitalize(username)}</h2>

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

      <small style={{ display: 'block', marginTop: '5rem' }}>
        Each username is unique and has its own score. Refresh the page to log in
        as another username.
      </small>
    </div>
  );
}

export default App;

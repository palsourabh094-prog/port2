'use client';

import React, { useState } from 'react';
import { X, Target, Brain, Hand, HelpCircle, Grid3x3, Palette } from 'lucide-react';

const GameHub = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameData, setGameData] = useState<Record<string, any>>({});

  const games = [
    { id: 'guess', icon: Target, title: 'Number Guesser', desc: 'Can you guess the secret number between 1 and 100?' },
    { id: 'memory', icon: Brain, title: 'Memory Match', desc: 'Test your memory with this classic card matching game!' },
    { id: 'rps', icon: Hand, title: 'Rock Paper Scissors', desc: 'Classic game of chance against the computer!' },
    { id: 'quiz', icon: HelpCircle, title: 'Quick Quiz', desc: 'Test your knowledge with fun trivia questions!' },
    { id: 'tictactoe', icon: Grid3x3, title: 'Tic Tac Toe', desc: 'The timeless classic! Can you beat the AI?' },
    { id: 'simon', icon: Palette, title: 'Color Simon', desc: 'Remember and repeat the color sequence!' }
  ];

  const GuessGame = () => {
    const [target] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [attempts, setAttempts] = useState(0);
    const [guess, setGuess] = useState('');
    const [result, setResult] = useState('');

    const makeGuess = () => {
      const g = parseInt(guess);
      setAttempts(a => a + 1);
      
      if (g === target) {
        setResult(`🎉 Correct! You got it in ${attempts + 1} attempts!`);
      } else if (g < target) {
        setResult('📈 Too low! Try higher.');
      } else {
        setResult('📉 Too high! Try lower.');
      }
      setGuess('');
    };

    return (
      <div className="space-y-4">
        <p className="text-gray-700">I'm thinking of a number between 1 and 100...</p>
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          placeholder="Enter your guess"
          min="1"
          max="100"
        />
        <button onClick={makeGuess} className="btn">Guess!</button>
        {result && <p className="text-gray-700">{result}</p>}
        <p className="text-2xl font-bold text-purple-600">Attempts: {attempts}</p>
      </div>
    );
  };

  const RPSGame = () => {
    const [score, setScore] = useState({ player: 0, computer: 0 });
    const [result, setResult] = useState('');

    const choices = ['rock', 'paper', 'scissors'] as const;
    type Choice = typeof choices[number];

    const playRPS = (choice: Choice) => {
      const computer: Choice = choices[Math.floor(Math.random() * 3)];
      const icons: Record<Choice, string> = { rock: '✊', paper: '✋', scissors: '✌️' };
      
      let res = '';
      if (choice === computer) {
        res = "It's a tie!";
      } else if (
        (choice === 'rock' && computer === 'scissors') ||
        (choice === 'paper' && computer === 'rock') ||
        (choice === 'scissors' && computer === 'paper')
      ) {
        res = 'You win this round!';
        setScore(s => ({ ...s, player: s.player + 1 }));
      } else {
        res = 'Computer wins this round!';
        setScore(s => ({ ...s, computer: s.computer + 1 }));
      }
      
      setResult(`You chose ${icons[choice]}, Computer chose ${icons[computer]}\n${res}`);
    };

    return (
      <div className="space-y-4">
        <p className="text-gray-700">Choose your weapon!</p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button onClick={() => playRPS('rock')} className="btn">✊ Rock</button>
          <button onClick={() => playRPS('paper')} className="btn">✋ Paper</button>
          <button onClick={() => playRPS('scissors')} className="btn">✌️ Scissors</button>
        </div>
        {result && <p className="text-gray-700 whitespace-pre-line">{result}</p>}
        <p className="text-2xl font-bold text-purple-600">
          You: {score.player} | Computer: {score.computer}
        </p>
      </div>
    );
  };

  const MemoryGame = () => {
  const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍒', '🥝'];
  const [cards] = useState(() => [...emojis, ...emojis].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

    const flipCard = (index: number) => {
      if (flipped.length >= 2 || matched.includes(index) || flipped.includes(index)) return;
      
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);
      
      if (newFlipped.length === 2) {
        setMoves(m => m + 1);
        
        setTimeout(() => {
          if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
            setMatched(m => [...m, ...newFlipped]);
            if (matched.length + 2 === 16) {
              alert(`🎉 You won in ${moves + 1} moves!`);
            }
          }
          setFlipped([]);
        }, 1000);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => flipCard(i)}
              className="h-16 text-3xl bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              {flipped.includes(i) || matched.includes(i) ? card : '❓'}
            </button>
          ))}
        </div>
        <p className="text-2xl font-bold text-purple-600">Moves: {moves}</p>
      </div>
    );
  };

  const QuizGame = () => {
    const questions = [
      { q: 'What is 5 + 7?', a: ['10', '12', '15', '11'], correct: 1 },
      { q: 'What color is the sky?', a: ['Green', 'Blue', 'Red', 'Yellow'], correct: 1 },
      { q: 'How many days in a week?', a: ['5', '6', '7', '8'], correct: 2 }
    ];
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);

    const checkAnswer = (choice: number) => {
      if (choice === questions[current].correct) {
        setScore(s => s + 1);
      }
      setCurrent(c => c + 1);
    };

    if (current >= questions.length) {
      return (
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
          <p className="text-3xl font-bold text-purple-600">Score: {score}/{questions.length}</p>
        </div>
      );
    }

    const q = questions[current];
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-gray-800">{q.q}</p>
        <div className="space-y-2">
          {q.a.map((ans, i) => (
            <button key={i} onClick={() => checkAnswer(i)} className="btn w-full">
              {ans}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const TicTacToeGame = () => {
    const [board, setBoard] = useState(Array(9).fill(''));
    const [player, setPlayer] = useState('X');
    const [result, setResult] = useState('');

    const checkWinner = (b: any[]) => {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (let line of lines) {
        const [a,b2,c] = line;
        if (b[a] && b[a] === b[b2] && b[a] === b[c]) {
          return b[a];
        }
      }
      return null;
    };

    const makeMove = (index: number) => {
      if (board[index] || checkWinner(board) || result) return;
      
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      
      const winner = checkWinner(newBoard);
      if (winner) {
        setResult(`${winner} wins!`);
        return;
      }
      
      if (!newBoard.includes('')) {
        setResult("It's a tie!");
        return;
      }
      
      if (player === 'X') {
        setPlayer('O');
        setTimeout(() => {
          const empty = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
          if (empty.length > 0) {
            const move = empty[Math.floor(Math.random() * empty.length)];
            const aiBoard = [...newBoard];
            aiBoard[move] = 'O';
            setBoard(aiBoard);
            
            const aiWinner = checkWinner(aiBoard);
            if (aiWinner) {
              setResult(`${aiWinner} wins!`);
            } else if (!aiBoard.includes('')) {
              setResult("It's a tie!");
            }
            setPlayer('X');
          }
        }, 500);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => makeMove(i)}
              className="h-20 text-4xl bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-bold"
            >
              {cell}
            </button>
          ))}
        </div>
        {result && <p className="text-xl font-bold text-center text-purple-600">{result}</p>}
      </div>
    );
  };

  const SimonGame = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSeq, setPlayerSeq] = useState<number[]>([]);
  const [level, setLevel] = useState(0);
  const [playing, setPlaying] = useState(false);

    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44'];

    const startRound = () => {
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setPlayerSeq([]);
      setLevel(l => l + 1);
      setPlaying(true);
      
      newSeq.forEach((color, i) => {
        setTimeout(() => {
          const btn = document.getElementById(`simon${color}`);
          if (btn) {
            btn.style.opacity = '0.5';
            setTimeout(() => btn.style.opacity = '1', 300);
          }
        }, i * 600);
      });
      
      setTimeout(() => setPlaying(false), newSeq.length * 600 + 300);
    };

    const handleClick = (color: number) => {
      if (playing || playerSeq.length >= sequence.length) return;
      
      const btn = document.getElementById(`simon${color}`);
      if (btn) {
        btn.style.opacity = '0.5';
        setTimeout(() => btn.style.opacity = '1', 300);
      }
      
      const newPlayerSeq = [...playerSeq, color];
      setPlayerSeq(newPlayerSeq);
      
      if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
        alert(`Game Over! You reached level ${level}`);
        setSequence([]);
        setPlayerSeq([]);
        setLevel(0);
        return;
      }
      
      if (newPlayerSeq.length === sequence.length) {
        setTimeout(startRound, 1000);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
          {colors.map((color, i) => (
            <button
              key={i}
              id={`simon${i}`}
              onClick={() => handleClick(i)}
              className="h-24 rounded-lg transition-opacity"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-2xl font-bold text-purple-600 text-center">Level: {level}</p>
        {level === 0 && (
          <button onClick={startRound} className="btn mx-auto block">Start Game</button>
        )}
      </div>
    );
  };

  const renderGame = () => {
    switch(activeGame) {
      case 'guess': return <GuessGame />;
      case 'memory': return <MemoryGame />;
      case 'rps': return <RPSGame />;
      case 'quiz': return <QuizGame />;
      case 'tictactoe': return <TicTacToeGame />;
      case 'simon': return <SimonGame />;
      default: return null;
    }
  };

  const getGameTitle = () => {
    const game = games.find(g => g.id === activeGame);
    return game ? game.title : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 p-5">
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease;
        }
        .btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 25px;
          font-size: 1em;
          cursor: pointer;
          margin: 5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-fadeInDown">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">🎮 Game Hub</h1>
          <p className="text-xl text-gray-100 opacity-90">Choose your adventure and play!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {games.map((game, idx) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="bg-white rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shadow-xl animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <Icon className="w-16 h-16 mx-auto mb-4 text-purple-600" strokeWidth={1.5} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h2>
                <p className="text-gray-600 leading-relaxed">{game.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {activeGame && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fadeInDown">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setActiveGame(null)}
              className="absolute top-4 right-6 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={32} />
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{getGameTitle()}</h2>
            <div className="bg-gray-50 rounded-2xl p-6 min-h-[200px]">
              {renderGame()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHub;
import React, { useState, useMemo } from "react";
import "./Square.css";

const Square = ({
  gameState,
  setGameState,
  socket,
  playingAs,
  currentElement,
  finishedArrayState,
  finishedState,
  id,
  currentPlayer,
  setCurrentPlayer,
}) => {
  const [localIcon, setLocalIcon] = useState(null);

  // Мемоизированные SVG компоненты
  const circleSvg = useMemo(() => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ), []);

  const crossSvg = useMemo(() => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ), []);

  const clickOnSquare = () => {
    // Проверка возможности хода
    if (playingAs !== currentPlayer || finishedState || localIcon) {
      return;
    }

    const newIcon = currentPlayer === "circle" ? circleSvg : crossSvg;
    setLocalIcon(newIcon);

    // Отправка хода на сервер
    socket.emit("playerMoveFromClient", {
      state: {
        id,
        sign: currentPlayer,
      },
    });

    // Обновление состояния игры
    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
    setGameState(prevState => {
      const newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = currentPlayer;
      return newState;
    });
  };

  // Определение классов для квадрата
  const squareClasses = [
    'square',
    finishedState ? 'not-allowed' : '',
    currentPlayer !== playingAs ? 'not-allowed' : '',
    finishedArrayState.includes(id) ? `${finishedState}-won` : '',
    finishedState && finishedState !== playingAs ? 'grey-background' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      onClick={clickOnSquare}
      className={squareClasses}
      aria-label={`Клетка ${Math.floor(id/3)+1}-${(id%3)+1}`}
    >
      {currentElement === "circle"
        ? circleSvg
        : currentElement === "cross"
        ? crossSvg
        : localIcon}
    </div>
  );
};

export default React.memo(Square);
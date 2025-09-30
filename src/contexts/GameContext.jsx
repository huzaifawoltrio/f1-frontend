import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// Initial state
const initialState = {
  isGameActive: false,
  gameStartTime: null,
  gameEndTime: null,
  elapsedTime: 0,
  completionTime: null,
  gameState: null,
  sessionId: null,
  targetPorts: [],
  error: null,
};

// Action types
const ACTIONS = {
  START_GAME: "START_GAME",
  END_GAME: "END_GAME",
  UPDATE_ELAPSED_TIME: "UPDATE_ELAPSED_TIME",
  UPDATE_GAME_STATE: "UPDATE_GAME_STATE",
  SET_ERROR: "SET_ERROR",
  RESET_GAME: "RESET_GAME",
};

// Reducer function
const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return {
        ...state,
        isGameActive: true,
        gameStartTime: action.payload.startTime,
        gameEndTime: null,
        elapsedTime: 0,
        completionTime: null,
        sessionId: action.payload.sessionId,
        targetPorts: action.payload.targetPorts,
        error: null,
      };

    case ACTIONS.END_GAME:
      const completionTime = action.payload.endTime - state.gameStartTime;
      return {
        ...state,
        isGameActive: false,
        gameEndTime: action.payload.endTime,
        completionTime: completionTime / 1000, // Convert to seconds
        elapsedTime: completionTime / 1000,
      };

    case ACTIONS.UPDATE_ELAPSED_TIME:
      return {
        ...state,
        elapsedTime: action.payload,
      };

    case ACTIONS.UPDATE_GAME_STATE:
      return {
        ...state,
        gameState: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTIONS.RESET_GAME:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

// Create context
const GameContext = createContext();

// API base URL
const API_BASE_URL = "https://f1backend.vercel.app/api";

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};

// Provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Timer effect - updates elapsed time every 10ms when game is active
  useEffect(() => {
    let interval;

    if (state.isGameActive && state.gameStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - state.gameStartTime) / 1000; // Convert to seconds
        dispatch({ type: ACTIONS.UPDATE_ELAPSED_TIME, payload: elapsed });
      }, 10); // Update every 10ms for smooth display
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isGameActive, state.gameStartTime]);

  // Status polling effect - checks game status every second when active
  useEffect(() => {
    let statusInterval;

    if (state.isGameActive && state.sessionId) {
      statusInterval = setInterval(async () => {
        await fetchGameStatus();
      }, 1000);
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [state.isGameActive, state.sessionId]);

  // Generate 12 random ports from 1-24
  const generateRandomPorts = () => {
    const allPorts = Array.from({ length: 24 }, (_, i) => i + 1);
    const shuffled = allPorts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  };

  // Start a new game
  const startGame = async () => {
    try {
      const targetPorts = generateRandomPorts();
      const response = await axios.post(`${API_BASE_URL}/game/start`, {
        targetPorts,
      });

      if (response.data.success) {
        const startTime = Date.now();
        dispatch({
          type: ACTIONS.START_GAME,
          payload: {
            startTime,
            sessionId: response.data.sessionId,
            targetPorts,
          },
        });

        // Fetch initial game state
        await fetchGameStatus();

        console.log("Game started with ports:", targetPorts);
      }
    } catch (error) {
      console.error("Error starting game:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to start game. Please check server connection.",
      });
    }
  };

  // Fetch current game status
  const fetchGameStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/game/status`);
      const data = response.data;

      dispatch({ type: ACTIONS.UPDATE_GAME_STATE, payload: data });

      // Check if game just completed
      if (data.endTime && state.isGameActive && !state.gameEndTime) {
        const endTime = new Date(data.endTime).getTime();
        dispatch({
          type: ACTIONS.END_GAME,
          payload: { endTime },
        });
      }
    } catch (error) {
      console.error("Error fetching game status:", error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: "Failed to fetch game status",
      });
    }
  };

  // Reset game state
  const resetGame = async () => {
    try {
      await axios.post(`${API_BASE_URL}/game/reset`);
      dispatch({ type: ACTIONS.RESET_GAME });
    } catch (error) {
      console.error("Error resetting game:", error);
      dispatch({ type: ACTIONS.RESET_GAME }); // Reset anyway
    }
  };

  // Get port display class based on status
  const getPortClass = (portNumber) => {
    if (!state.gameState) return "inactive";

    const portData = state.gameState.ports?.find((p) => p.port === portNumber);
    if (!portData) return "inactive";

    // Target ports that are turned on should be green
    if (portData.isTarget && portData.status === "up") {
      return "purple-state";
    }
    // Target ports that are still off should be purple
    else if (portData.isTarget && portData.status === "down") {
      return "green-state";
    }
    // Non-target ports
    else {
      return "inactive";
    }
  };

  const contextValue = {
    // State
    ...state,

    // Actions
    startGame,
    resetGame,
    fetchGameStatus,
    getPortClass,

    // Computed values
    isGameComplete: state.gameEndTime !== null,
    completionTimeFormatted: state.completionTime
      ? state.completionTime.toFixed(2)
      : null,
    elapsedTimeFormatted: state.elapsedTime.toFixed(2),
    targetPortsCount: state.targetPorts.length,
    completedTargetsCount: state.gameState?.completedTargets || 0,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

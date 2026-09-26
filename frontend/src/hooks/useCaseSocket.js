import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export function useCaseSocket(caseId) {
  const [isConnected, setIsConnected] = useState(false);
  const [agentStates, setAgentStates] = useState({
    market: { status: 'idle', step: '', detail: '', finding: null },
    competitor: { status: 'idle', step: '', detail: '', finding: null },
    financial: { status: 'idle', step: '', detail: '', finding: null },
    risk: { status: 'idle', step: '', detail: '', finding: null },
  });
  const [debatePoints, setDebatePoints] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const [fullCaseData, setFullCaseData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      setIsConnected(true);
      if (caseId) {
        socket.emit('join:case', caseId);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    if (caseId) {
      socket.emit('join:case', caseId);
    }

    socket.on('agent:start', ({ agent }) => {
      setAgentStates((prev) => ({
        ...prev,
        [agent]: { ...prev[agent], status: 'running', step: 'Initializing' },
      }));
    });

    socket.on('agent:step', ({ agent, step, detail }) => {
      setAgentStates((prev) => ({
        ...prev,
        [agent]: { ...prev[agent], status: 'running', step, detail },
      }));
    });

    socket.on('agent:done', ({ agent, finding }) => {
      setAgentStates((prev) => ({
        ...prev,
        [agent]: { ...prev[agent], status: 'done', step: 'Completed', finding },
      }));
    });

    socket.on('synthesis:point', (point) => {
      setDebatePoints((prev) => [...prev, point]);
    });

    socket.on('report:ready', ({ verdict: finalVerdict, report }) => {
      setVerdict(finalVerdict);
      if (report) setFullCaseData(report);
    });

    socket.on('case:error', ({ message }) => {
      setError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [caseId]);

  return {
    isConnected,
    agentStates,
    debatePoints,
    verdict,
    fullCaseData,
    error,
    resetState: () => {
      setAgentStates({
        market: { status: 'idle', step: '', detail: '', finding: null },
        competitor: { status: 'idle', step: '', detail: '', finding: null },
        financial: { status: 'idle', step: '', detail: '', finding: null },
        risk: { status: 'idle', step: '', detail: '', finding: null },
      });
      setDebatePoints([]);
      setVerdict(null);
      setFullCaseData(null);
      setError(null);
    },
  };
}

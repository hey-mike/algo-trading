// client-app/src/components/RealTimeData.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5002');

const RealTimeData = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    socket.on('data', (newData) => {
      setData(newData);
    });

    return () => {
      socket.off('data');
    };
  }, []);

  return (
    <div>
      <h2>Real-Time Data</h2>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default RealTimeData;

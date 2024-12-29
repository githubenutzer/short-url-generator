import React, { useState, useEffect, useCallback } from 'react';
import { fetchLinkRedirects } from '../services/AuthorizationService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsGraph = ({ short }) => {
  const [clicksData, setClicksData] = useState([]);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('day');

  const groupByInterval = (data, interval) => {
    const formatDate = (date) => {
      const d = new Date(date);
      if (interval === 'day') {
        return `${d.toISOString().split('T')[0]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      } else if (interval === 'week') {
        const minutes = Math.floor(d.getMinutes() / 30) * 30;
        return `${d.toISOString().split('T')[0]} ${String(d.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      } else if (interval === 'month' || interval === 'year' || interval === 'all') {
        return d.toISOString().split('T')[0];
      }
      return date;
    };

    const groupedData = data.reduce((acc, timestamp) => {
      const formattedDate = formatDate(timestamp);
      acc[formattedDate] = (acc[formattedDate] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([timestamp, count]) => ({
      timestamp,
      count,
    }));
  };

  const handleChangeInterval = (newInterval) => {
    setInterval(newInterval);
  };

  const loadClicksData = useCallback(async () => {
    try {
      const data = await fetchLinkRedirects(short);
      if (Array.isArray(data)) {
        const transformedData = groupByInterval(data, interval);
        setClicksData(transformedData);
      } else {
        setError('Дані по переходам мають бути у вигляді масиву');
      }
    } catch (err) {
      setError('Помилка при завантаженні статистики переходів');
      console.error('Помилка при завантаженні статистики переходів:', err);
    }
  }, [short, interval]);

  useEffect(() => {
    loadClicksData();
  }, [loadClicksData]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div>
        {clicksData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={clicksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={(tick) => {
                      const date = new Date(tick);
                      if (interval === 'day') {
                        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                      } else if (interval === 'week') {
                        const minutes = Math.floor(date.getMinutes() / 30) * 30;
                        return `${String(date.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                      } else if (interval === 'month' || interval === 'year' || interval === 'all') {
                        return date.toISOString().split('T')[0];
                      }
                      return tick;
                    }}
                />
                <YAxis />
                <Tooltip
                    formatter={(value) => [`Кількість: ${value}`, 'Дата']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      if (interval === 'day') {
                        return `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                      } else if (interval === 'week') {
                        const minutes = Math.floor(date.getMinutes() / 30) * 30;
                        return `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                      } else if (interval === 'month' || interval === 'year' || interval === 'all') {
                        return date.toISOString().split('T')[0];
                      }
                      return label;
                    }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
        ) : (
            <div>Відсутні дані для графіка</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
          <span onClick={() => handleChangeInterval('day')} style={textButtonStyle}>1 д.</span>
          <span onClick={() => handleChangeInterval('week')} style={textButtonStyle}>1 тиж.</span>
          <span onClick={() => handleChangeInterval('month')} style={textButtonStyle}>1 міс.</span>
          <span onClick={() => handleChangeInterval('year')} style={textButtonStyle}>1 рік</span>
          <span onClick={() => handleChangeInterval('all')} style={textButtonStyle}>MAX</span>
        </div>
      </div>
  );
};

const textButtonStyle = {
  fontSize: '16px',
  cursor: 'pointer',
  color: '#4CAF50',
  textDecoration: 'underline',
  transition: 'color 0.3s',
};

export default StatsGraph;

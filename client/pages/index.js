import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/import-logs').then(res => {
      setLogs(res.data);
    });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color:"#000" }}>📊 Import History</h1>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th style={thStyle}>File Name</th>
              <th style={thStyle}>Import DateTime</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>New</th>
              <th style={thStyle}>Updated</th>
              <th style={thStyle}>Failed</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ ...tdStyle, textAlign: 'center' }}>No logs available</td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={log._id} style={index % 2 === 0 ? rowEvenStyle : {}}>
                  <td style={tdStyle}>
                    <a href={log.fileName} target="_blank" rel="noopener noreferrer" style={{ color: '#66b3ff'}}>
                      {log.fileName}
                    </a>
                  </td>
                  <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={tdStyle}>{log.totalFetched}</td>
                  <td style={tdStyle}>{log.newJobs}</td>
                  <td style={tdStyle}>{log.updatedJobs}</td>
                  <td style={{
                    ...tdStyle,
                    color: (log.failedJobs?.length || 0) > 0 ? '#b30000' : 'inherit',
                    fontWeight: (log.failedJobs?.length || 0) > 0 ? 'bold' : 'normal'
                  }}>
                    {log.failedJobs?.length || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  minWidth: '800px',
  color:"#000"
};

const thStyle = {
  padding: '12px 15px',
  border: '1px solid #ddd',
  fontWeight: 'bold',
  textAlign: 'left',
  background: '#fafafa',
  color:"#000"
};

const tdStyle = {
  padding: '12px 15px',
  border: '1px solid #eee',
  textAlign: 'left',
  color:"#000"
};

const rowEvenStyle = {
  backgroundColor: '#fafafa'
};

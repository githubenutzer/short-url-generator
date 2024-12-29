import React from 'react';
import { useParams } from 'react-router-dom';
import StatsGraph from '../components/StatsGraph';
import '../styles/urlStats.css';
import { useNavigate } from 'react-router-dom';

const UrlStats = () => {
  const { short } = useParams();
  const navigate = useNavigate();

  return (
    <section className='page-chart'>
        <nav className="navigate">
            <div className="logo">🌐 Short URL Generator</div>
            <div onClick={() => navigate(-1)} className="back-button"><b>BACK</b></div>
        </nav>
        <div className='graph'>
            <h1>
                Статистика переходів за посиланням:&nbsp;
          <a 
            href={`http://localhost:8000/${short}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {short}
          </a>
        </h1>
        <StatsGraph short={short} />
      </div>
    </section>
  );
};

export default UrlStats;

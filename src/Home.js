import React, { useState, useEffect } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import sharedVariables from './sharedVariables';
import YouTubePlayer from './YTPlayer';

function Home() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [countNumbers, setCountNumbers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  console.log(sharedVariables)

  if(!sharedVariables.loginUser) {
    navigate("/");
  }

  useEffect(() => {
    axios.get('http://localhost:8081/languages')
      .then(response => {
        setLanguages(response.data);
      })
      .catch(error => {
        console.error('Error fetching languages:', error);
      });
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    axios.get(`http://localhost:8081/videoUrl?language=${language}`)
      .then(response => {
        setVideoUrl(response.data.url);
      })
      .catch(error => {
        console.error('Error fetching video URL:', error);
      });
    axios.get(`http://localhost:8081/vocabulary?language=${language}`)
      .then(response => {
        setVocabulary(response.data);
      })
      .catch(error => {
        console.error('Error fetching vocabulary:', error);
      });
    axios.get(`http://localhost:8081/countNumbers?language=${language}`)
      .then(response => {
        setCountNumbers(response.data);
      })
      .catch(error => {
        console.error('Error fetching Numbers:', error);
      });
    setDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    sharedVariables.loginUser = null;
    alert("Logged out!")
    navigate("/");
  };

  const handleDeleteUser = () => {
    axios.delete(`http://localhost:8081/deleteUser?userName=${sharedVariables.loginUser.name}&userEmail=${sharedVariables.loginUser.email}`)
      .then(response => {
        alert(response.data);
        handleLogout();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  }

  return (
    <div className='d-flex bg-success min-vh-100'>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <h1>Select Your Language</h1>
          </div>
          <div className="col-auto">
          {sharedVariables.loginUser &&
          <DropdownButton
            id="profile-dropdown"
            title={sharedVariables.loginUser.name}
            variant="primary"
            show={showDropdown}
            onToggle={handleToggleDropdown}
          >
            <Dropdown.Item onClick={handleDeleteUser}>Delete User</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </DropdownButton>}
          </div>
        </div>
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>
            <span className="bi bi-translate me-2" /> {selectedLanguage || 'Select Language'}
          </DropdownToggle>
          <DropdownMenu>
            {languages.map((language, index) => (
              <DropdownItem key={index} onClick={() => handleLanguageChange(language)}>
                {language}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        {selectedLanguage && (
          <div className="mt-3">
            <h2>Vocabulary ({selectedLanguage})</h2>
            <ul>
              {vocabulary.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.word}:</strong> {entry.meaning}
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedLanguage && (
          <div className="mt-3">
            <h2>Learn to count from 0-10 ({selectedLanguage})</h2>
            <ul>
              {countNumbers.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.word} ({entry.number}):</strong> {entry.meaning}
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedLanguage && videoUrl && (
          <div className="mt-3">
            <h2>Basic {selectedLanguage} Conversation</h2>
            {/* <video controls> */}
              {/* <source src={videoUrl} type="video/mp4" /> */}
              {/* <source src="https://www.youtube.com/watch?v=nf1rzqG3nvA&t=1s" type="video/mp4" /> */}
            {/* </video> */}
            <YouTubePlayer videoUrl={videoUrl}></YouTubePlayer>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

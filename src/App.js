import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'; // Asegúrate de importar el archivo CSS

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[.\-!$@?%#&]/.test(password);
    const noSequences = !/(.)\1\1|012|123|234|345|456|567|678|789|890/.test(password);
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar &&
      noSequences
    );
  };  

  const handleEncrypt = () => {
    if (!validatePassword(password)) {
      setError('La contraseña no cumple con los criterios de robustez.');
      return;
    }

    setError('');
    const data = { username, password };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
    setEncryptedData(encrypted);

    // Simular almacenamiento en XML
    const xmlData = `<user><data>${encrypted}</data></user>`;
    localStorage.setItem('userData', xmlData);
  };

  const handleDecrypt = () => {
    const xmlData = localStorage.getItem('userData');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    const encrypted = xmlDoc.getElementsByTagName('data')[0].childNodes[0].nodeValue;

    const bytes = CryptoJS.AES.decrypt(encrypted, 'secret key 123');
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setDecryptedData(decrypted);
  };

  return (
    <div className="container">
      <h1>Encriptar Usuario y Contraseña</h1>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEncrypt}>Cifrar y Guardar</button>
      {error && <p className="error">{error}</p>}
      {encryptedData && <p className="encrypted-data">Datos encriptados: {encryptedData}</p>}
      <button onClick={handleDecrypt}>Leer y Descifrar</button>
      {decryptedData && (
        <div>
          <p>Usuario: {decryptedData.username}</p>
          <p>Contraseña: {decryptedData.password}</p>
        </div>
      )}
    </div>
  );
};

export default App;

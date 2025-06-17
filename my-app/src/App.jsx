import React, { useEffect, useState } from 'react';

const API_contacts = 'http://localhost:5271/contacts';
const API_users = 'http://localhost:5271/user';

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editContact, setEditContact] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
  const [loggedInUsername, setLoggedInUsername] = useState('');

  const loadContacts = () => {
    fetch(API_contacts)
      .then(res => res.json())
      .then(setContacts);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadContacts();
    }
    else {
      setContacts([]);
    }
  }, [isLoggedIn]);

  const handleRegister = e => {
    e.preventDefault();
    fetch(API_users, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    }).then(() => {
      setRegisterForm({ username: '', password: '' });
      alert('Registration successful!');
    });
  };

  const handleLogin = e => {
    e.preventDefault();
    fetch(API_users, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginForm)
    }).then(res => {
      if (res.ok) {
        setIsLoggedIn(true);
        setLoggedInUsername(loginForm.username);
        setLoginForm({ username: '', password: '' });
      } else {
        alert('Login failed. Please check your credentials.');
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(API_contacts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ name: '', email: '' });
      loadContacts();
    });
  };

  const handleDelete = id => {
    fetch(`${API_contacts}/${id}`, { method: 'DELETE' }).then(loadContacts);
  };

  const handleUpdateSubmit = e => {
    e.preventDefault();
    if (editContact) {
      fetch(`${API_contacts}/${editContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContact)
      }).then(() => {
        setEditContact(null);
        loadContacts();
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUsername('');
    setContacts([]);
    setForm({ name: '', email: '' });
    setEditContact(null);
    setLoginForm({ username: '', password: '' });
    setRegisterForm({ username: '', password: '' });
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Contact Manager</h1>

      {!isLoggedIn ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button type="submit">Login</button>
          </form>

          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              placeholder="Username"
              value={registerForm.username}
              onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Welcome, {loggedInUsername}! </h2>
          <button onClick={handleLogout}>Logout</button>
        
        <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {contacts.map(c => (
          <li key={c.id}>
            {c.userId} {c.name} ({c.email}){' '}
            <button onClick={() => handleDelete(c.id)}>Delete</button>
            <button onClick={() => setEditContact(c)}>Update</button>
          </li>
        ))}
      </ul>

      {editContact && (
        <form onSubmit={handleUpdateSubmit} style={{ marginTop: '1rem' }}>
          <h2>Update Contact</h2>
          <input
            placeholder="Name"
            value={editContact.name}
            onChange={e => setEditContact({ ...editContact, name: e.target.value })}
          />
          <input
            placeholder="Email"
            value={editContact.email}
            onChange={e => setEditContact({ ...editContact, email: e.target.value })}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditContact(null)}>Cancel</button>
        </form>
      )}
    </div>
      )}
    </div>
  );
}

export default App;

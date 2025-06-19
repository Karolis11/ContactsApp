import React, { use, useEffect, useState } from 'react';

const API_contacts = 'http://localhost:5271/contacts';
const API_users = 'http://localhost:5271/user';

function App() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editContact, setEditContact] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '',  password: '' });
  const [loggedInUsername, setLoggedInUsername] = useState('');

  const loadContacts = () => {
    const token = localStorage.getItem('jwtToken'); // Retrieve token from localStorage
    fetch(API_contacts, {
      headers: { Authorization: `Bearer ${token}` } // Include token in Authorization header
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Unauthorized');
        }
      })
      .then(setContacts)
      .catch(err => alert(err.message));
    };

  const loadUsers = () => {
    fetch(API_users)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error loading users:', err));
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadContacts();
    }
    else {
      setContacts([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      loadUsers();
    }
    else {
      setUsers([]);
    }
  }, [isLoggedIn]);

  const handleRegister = e => {
    e.preventDefault();
    fetch(API_users, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    }).then(() => {
      setRegisterForm({ username: '', email: '', password: '' });
      alert('Registration successful!');
    });
  };

  const handleLogin = e => {
    e.preventDefault();
    fetch(API_users + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password
      })
    }).then(res => {
      if (res.ok) {
        res.text().then(token => {
          localStorage.setItem('jwtToken', token); // Store token in localStorage
          setIsLoggedIn(true);
          setLoggedInUsername(loginForm.username);
        });
      } else {
        alert('Login failed. Please check your credentials.');
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(API_contacts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
       },
      body: JSON.stringify(form)
    }).then(() => {
      setForm({ name: '', email: '' });
      loadContacts();
    });
  };

  const handleDelete = id => {
    fetch(`${API_contacts}/${id}`, { 
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
    }).then(loadContacts);
  };

  const handleUpdateSubmit = e => {
    e.preventDefault();
    if (editContact) {
      fetch(`${API_contacts}/${editContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
         },
        body: JSON.stringify(editContact)
      }).then(() => {
        setEditContact(null);
        loadContacts();
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwtToken'); 
    setLoggedInUsername('');
    setContacts([]);
    setForm({ name: '', email: '' });
    setEditContact(null);
    setLoginForm({ username: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '' });
  }

  const handleAddUser = (username, email) => {
    console.log('Adding user:', username);
    fetch(API_contacts, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
       },
       body: JSON.stringify({name: username, email: email})
    }).then(() => {
      setForm({ name: '', email: '' });
      loadContacts();
    });
  }


  return (
    <div style={{ padding: '2rem' }}>
      <h1>Contact Manager</h1>

      <div>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} 
              <button onClick={() => handleAddUser(user.username, user.email)}>Add To Contacts</button>
            </li>
          ))}
        </ul>
      </div>

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
              placeholder='Email'
              value={registerForm.email}
              onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
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
            {c.name} ({c.email}){' '}
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

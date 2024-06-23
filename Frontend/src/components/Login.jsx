import React, { useState } from 'react';
function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div style={styled.container}>
            <h2 style={styled.heading}>Login</h2>
            <form onSubmit={handleSubmit} style={styled.form}>
                <label style={styled.label}>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={styled.input} />
                </label>
                <label style={styled.label}>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styled.input} />
                </label>
                <button type="submit" style={styled.button}>Submit</button>
            </form>
        </div>
    );
}

export default LoginPage;

const styled = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'whitesmoke',
        width: '100%',
    },
    heading: {
        color: 'black',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,2,0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    label: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: '16px',
        color: 'black',
        fontWeight: '500',
    },
    input: {
        padding: '10px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        ':focus': {
            borderColor: '#E0FFFF',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
    button: {
        padding: '10px 20px',
        backgroundColor: 'rgb(108, 99, 255)',
        color: 'cyan',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};
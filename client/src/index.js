import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client';

const App = () => {

    useEffect(
        () => {
            fetch('/product/hello')
                .then(response => response.json())
                .then(data => {
                    console.log(data); setMessage(data.message)
                })
                .catch(err => console.log(err))


        }, []
    )
    const [message, setMessage] = useState('')
    return (
        <div className="app">
            <h1>{message}</h1>
        </div >
    )
}

//ReactDOM.render(<App />, document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
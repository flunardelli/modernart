import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from  'firebase'

var config = {
	apiKey: "AIzaSyAvlavYs_eyjBqKgFM-y_wfauB7wOAgPws",
	authDomain: "modernart-7254d.firebaseapp.com",
	databaseURL: "https://modernart-7254d.firebaseio.com",
	projectId: "modernart-7254d",
	storageBucket: "",
	messagingSenderId: "980508862082"
};
firebase.initializeApp(config);

ReactDOM.render(<App firebase={firebase}/>, document.getElementById('root'));
registerServiceWorker();

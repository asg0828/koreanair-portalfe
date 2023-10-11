import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import rootReducer from '@reducers';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_NODE_ENV !== 'prod',
});

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import rootReducer from '@reducers';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Providers } from '@components/ui';

export const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_NODE_ENV !== 'prod',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={reduxStore}>
    <Providers>
      <App />
    </Providers>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

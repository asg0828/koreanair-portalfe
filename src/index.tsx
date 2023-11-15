import store from '@/store';
import { Providers } from '@components/ui';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient: any = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {},
  }),
  defaultOptions: {
    queries: {
      suspense: true,
      enabled: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
    },
    mutations: {
      cacheTime: 0,
      onError: (error, query) => {},
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <Providers>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Providers>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

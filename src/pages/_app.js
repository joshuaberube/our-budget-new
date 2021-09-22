import { initializeApp } from 'firebase/app'
import Layout from '../components/Layout';
import 'tailwindcss/tailwind.css'

const firebaseConfig = {
  apiKey: 'AIzaSyA3pikzlg5KAJB3QTYhw1qv6ZvWrzcRJd4',
  authDomain: 'our-budget-ddd27.firebaseapp.com',
  projectId: 'our-budget-ddd27',
  storageBucket: 'our-budget-ddd27.appspot.com',
  messagingSenderId: '489537376887',
  appId: '1:489537376887:web:23b55d91bb42b725636c72',
  measurementId: 'G-XFW7VQJ47E'
};

initializeApp(firebaseConfig)

const App = ({ Component, pageProps }) => (
  <Layout>
    <Component {...pageProps} />
  </Layout>
)

export default App

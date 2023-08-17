import '@/styles/globals.css'
import { CombinedProvider, ConnectionProvider } from '@/services/ConnectionContext'

export default function App({ Component, pageProps }) {
  return (<CombinedProvider>
    <Component {...pageProps} />
    </CombinedProvider>);
  
}

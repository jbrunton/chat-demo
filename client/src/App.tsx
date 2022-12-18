import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import reactLogo from './assets/react.svg'
import './App.css'

const useApiResponse = () => {
  const url = import.meta.env.VITE_API_URL || "";
  return useQuery({
    queryKey: ['api'],
    queryFn: () => fetch(url).then(res => res.text())
  })
}

function App() {
  const [count, setCount] = useState(0)
  const { isLoading, data: apiResponse } = useApiResponse();

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <p>Api response: <span>{isLoading ? "loading" : apiResponse}</span></p>
      </div>      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

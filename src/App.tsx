import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="video-container">
        <video 
          src="/nrem_animation.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="fullscreen-video"
        />
      </div>
      <div className="text-container">
        <h1>NREM</h1>
      </div>
    </div>
  )
}

export default App

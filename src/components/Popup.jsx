export default function Popup({message, buttonMessage, onClick}) {
  return (
    <div id="popup-container">
        <div id="popup-bg"></div>
        <div id="popup">
          <p>{message}</p>
          <button className="button red" onClick={onClick}>{buttonMessage}</button>
        </div>
      </div>
  )
}
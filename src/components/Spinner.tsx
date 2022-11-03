export default function Spinner() {
  return (
      <div className="height-full flex justify-center items-center">
          <div style={{ borderTopColor : 'transparent'}}
              className="w-8 h-8 border-4 border-festa-two border-solid rounded-full animate-spin"></div>
      </div>
  )
}
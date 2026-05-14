// import error hook and styles
import { useRouteError } from "react-router"
import { errorClass } from "../styles/common"

// error boundary component
function ErrorBoundary() {
  // get error details
  const {data,status,statusText}=useRouteError()
  // return error message
  return (
    <div className={errorClass+"flex content-center text-center"}>
      <p>{data}</p>
      <p>{status}-{statusText}</p>
    </div>
  )
}

export default ErrorBoundary

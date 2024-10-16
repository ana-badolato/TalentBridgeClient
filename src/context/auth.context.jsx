import { createContext, useEffect, useState } from "react"
import service from "../services/config"


const AuthContext = createContext()

function AuthWrapper(props) {
  return (
    <div>auth.context</div>
  )
}

export{
  AuthContext,
  AuthWrapper
}
  
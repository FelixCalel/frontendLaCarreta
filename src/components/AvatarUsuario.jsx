import { Avatar, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"




const AvatarUsuario = () => {
  // const [nombresUsuario, setNombresUsuario] = useState('')
  const actualUsuario = useSelector((state) => state.auth)

  return (
    <div>
      <Stack direction='row'>
        <Avatar name={actualUsuario.displayName} src='#' />
      </Stack>
    </div>
  )
}

export default AvatarUsuario

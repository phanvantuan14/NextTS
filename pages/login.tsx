
import { Button } from "@mui/material"
import Head from "next/head"
import Image from "next/image"
import styled from "styled-components"
import logo from "../asset/logo.png"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { auth } from "@/confix/firebase"


const StyledContainer = styled.div`
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: whitesmoke;
`
const StyledLoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`
const StyledImage = styled.div`
    margin-bottom: 50px;
`
const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)

    const signIn = () => signInWithGoogle()

  return (
    <StyledContainer>
        <Head>
            <title>Login</title>
        </Head>

        <StyledLoginContainer>
            <StyledImage>
                <Image src={logo} alt='logo' style={{width:'200px', height:'200px'}} />
            </StyledImage>

            <Button variant="outlined" onClick={signIn}> Sign in with Google</Button>
        </StyledLoginContainer>
    </StyledContainer>
  )
}

export default Login
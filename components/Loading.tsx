import React from 'react'
import styled from 'styled-components'
import Image from "next/image"
import logo from "../asset/logo.png"
import { CircularProgress } from '@mui/material'

const StyledContainer = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const StyledImage = styled.div`
    margin-bottom: 50px;
`


const Loading = () => {
  return (
  <StyledContainer>
    <StyledImage>
      <Image src={logo} alt='logo' style={{width:'200px', height:'200px'}} />
    </StyledImage>
    <CircularProgress/>
  </StyledContainer>
  )
}

export default Loading
import { useRecipient } from "@/hooks/useRecipient"
import { Avatar } from "@mui/material"
import styled from "styled-components"

type Props = ReturnType<typeof useRecipient>

const StyleAvatar = styled(Avatar)`
    margin: 5px 15px 5px 5px;
`

const RecipientAvatar = ({recipient, recipientEmail} : Props) => {

  return recipient?.photoURL 
  ? <StyleAvatar src={recipient.photoURL}/> 
  : <StyleAvatar> {recipientEmail && recipientEmail[0].toLocaleUpperCase()} </StyleAvatar> 

}


export default RecipientAvatar
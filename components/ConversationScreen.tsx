import  Message  from "./Message"
import styled from "styled-components"
import { KeyboardEventHandler, MouseEventHandler, useRef, useState } from 'react'
import { useRouter } from "next/router"
import { auth, db } from "@/confix/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { IconButton } from "@mui/material"
import RecipientAvatar from "./RecipientAvatar"
import { Conversation, IMessage } from "@/types"
import { useRecipient } from "@/hooks/useRecipient"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import { useCollection } from "react-firebase-hooks/firestore"
import SendIcon from  "@mui/icons-material/Send"
import MicIcon from  "@mui/icons-material/Mic"
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon"

import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { convertFirestoreTimesToString, generateQueryGetMessages, transformMessages } from "@/utils/getMessagesInConversation"


const StydedRecipientHeader = styled.div`
    position: sticky;
    background-color: white;
    z-index: 1;
    top: 0;
    display: flex;
    align-items: center;
    padding: 11px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;    
`

const StyledHeaderInfo = styled.div`
  flex-grow: 1;
  >h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }
  >span {
    font-size: 14px;
    color: gray;
  }
`
const StyleH3 = styled.h3`
   word-break: break-all;
`
const StyledHeaderIcons = styled.div`
  display: flex;
`
const StyledMessagesContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`
const StyledInputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`
const StyledInput = styled.input`
    flex-grow: 1;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 15px;
    margin-left: 15px;
    margin-right: 15px;
`
const EndOfMessagesForAutoScroll = styled.div`
    margin-bottom: 30px;
`

const ConversationScreen = ({conversation, messages} : {conversation : Conversation, messages: IMessage[]}) => {
    const router = useRouter()
    const conversationId = router.query.id
    const conversationUsers = conversation.users
    const [newMessage, setNewMessage] = useState('')
    const [loggerInUser, _loading, _error] = useAuthState(auth)
    const {recipientEmail, recipient} = useRecipient(conversationUsers)
    const queryGetMessages = generateQueryGetMessages(conversationId as string)
    const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages)

    const showMessages = () => {
        //nhap messages tu props
        if(messagesLoading){
            return messages.map((message)=> 
                <Message key={message.id} message={message}/>
            )
        } 
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map((message) =>
                <Message key={message.id} message={transformMessages(message)}/>
            )
        }   

        return null
    }

    const addMessageToDbAndUpdateLastSeen = async() =>{
        await setDoc( doc(db, 'users', loggerInUser?.email as string), 
        {lastSeen: serverTimestamp()},
        { merge: true})

        await addDoc( collection(db, 'messages'), 
        { 
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: loggerInUser?.email,
        } )
        //reset message in input
        setNewMessage('')
        //srcoll to botton
        scrollToBotton()
    } 

    const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = event =>{
        if(event.key === 'Enter'){
            event.preventDefault()
            if(!newMessage) return
            addMessageToDbAndUpdateLastSeen ()
        }
    }

    const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = event =>{
        event.preventDefault()
        if(!newMessage) return
        addMessageToDbAndUpdateLastSeen ()
    }

    const endOfMessageRef = useRef<HTMLDivElement>(null)
    const scrollToBotton = () => {
        endOfMessageRef.current?.scrollIntoView({behavior:'smooth'})
    }

    return (
        <>
            <StydedRecipientHeader>
                <RecipientAvatar recipient= {recipient}  recipientEmail= {recipientEmail}/>
                <StyledHeaderInfo>
                    <StyleH3>{recipientEmail}</StyleH3>
                    {recipient && (
                        <span>
                            Last active: {' '}
                            {convertFirestoreTimesToString(recipient.lastSeen)}
                        </span>
                        )
                    }
                </StyledHeaderInfo>
                <StyledHeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </StyledHeaderIcons>
            </StydedRecipientHeader>

            <StyledMessagesContainer>
                {showMessages()}
                {/* auto sroll the end to the message */}
                <EndOfMessagesForAutoScroll ref={endOfMessageRef}/>
            </StyledMessagesContainer>

            {/* enter new messages */}
            <StyledInputContainer>
                <InsertEmoticonIcon/>
                <StyledInput 
                    value={newMessage} 
                    onChange={event => setNewMessage(event.target.value)}
                    onKeyDown= {sendMessageOnEnter}
                />
                <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
                    <SendIcon/>
                </IconButton>
                <IconButton>
                    <MicIcon/>
                </IconButton>
            </StyledInputContainer>
        </>
    )
}

export default ConversationScreen
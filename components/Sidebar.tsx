import { useState } from "react"
import  styled  from "styled-components"
import { Avatar, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, IconButton  } from "@mui/material"

import ChatIcon  from "@mui/icons-material/Chat"
import MoreVerticalIcon  from "@mui/icons-material/MoreVert"
import LogoutIcon  from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import { signOut } from "firebase/auth"
import { auth, db } from "@/confix/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"

import * as EmailValidator from "email-validator"
import { addDoc, collection, query, where } from "firebase/firestore"
import { Conversation } from "@/types"
import ConversationSelec from "./ConversationSelec"



const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid whitesmoke;
    ::-webkit-scrollbar {
    display: none;
    }

    -ms-overflow-style: none;  
    scrollbar-width: none;  
    
`

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    hieght: 80px;
    border-bottom:1px solid whitesmoke;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
`
const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;

`
const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`

const StyleSidebarButtom = styled(Button)`
    width:100%;
    border-top:1px solid whitesmoke;
    border-bottom:1px solid whitesmoke;
    font-weight: 600;
`
const StyledUserAvater = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }

`

const Sidebar = () => {
    const [loggerInUser, _loading, _error] = useAuthState(auth)

    const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] = useState(false)

    const [recipientEmail, setRecipientEmail] = useState('')

    const toggleNewConversation = (isOpen: boolean) =>{
        setIsOpenNewConversationDialog(isOpen)
        if(!isOpen) setRecipientEmail('')
    }

    const queryGetConversationForCurrenUser = query( 
        collection(db,'conversations'), 
        where('users','array-contains', loggerInUser?.email)
    )
    const [conversationSnapshot ] = useCollection(queryGetConversationForCurrenUser)

    const isConversationAlreadyExists = (recipientEmail:string) => {
        return conversationSnapshot?.docs.find(conversation => 
            (conversation.data() as Conversation).users.includes(recipientEmail))
    }

    const closeConversation = () => toggleNewConversation(false)

    const createConversation = async() =>{
        if(!recipientEmail) return 
        const isInvitingSeft = recipientEmail === loggerInUser?.email

        if(EmailValidator.validate(recipientEmail) && !isInvitingSeft && !isConversationAlreadyExists(recipientEmail)) {
            await addDoc(collection(db, 'conversations'), 
            {
                users: [loggerInUser?.email, recipientEmail]
            })
        }


        closeConversation()
    }

    const logout = async () =>{
        try {
            await signOut(auth)
        } catch (error) {
            alert("Logout error")
        }
    }

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip title={loggerInUser?.email as string} placement="right">
                    <StyledUserAvater src={loggerInUser?.photoURL || ""} />
                </Tooltip>
                <div>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon />
                    </IconButton>
                    <IconButton onClick={logout} >
                        <LogoutIcon  />
                    </IconButton>
                </div>
            </StyledHeader>

            <StyledSearch>
                <SearchIcon/>
                <StyledSearchInput placeholder = 'Tim kiem ban chat...'/>
            </StyledSearch>

            <StyleSidebarButtom onClick={()=> toggleNewConversation(true)}>START A NEW CONVERSATION</StyleSidebarButtom>

            {/* List chat */}
            {conversationSnapshot?.docs.map ( (conversation) => {
                 return (
                    <ConversationSelec 
                        key={conversation.id}  
                        id={conversation.id}
                        conversationUsers={(conversation.data() as Conversation).users}
                    />
                )
            })}


            <Dialog open={isOpenNewConversationDialog} onClose={closeConversation}>
                <DialogTitle>New Conversation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your email address to the chat ok!! 
                    </DialogContentText>
                    <TextField
                        autoFocus 
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientEmail}
                        onChange= {e => setRecipientEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConversation}>Cancel</Button>
                    <Button disabled={!recipientEmail} onClick={createConversation}>Create</Button>
                </DialogActions>    
            </Dialog>   
        </StyledContainer>
    )
}

export default Sidebar
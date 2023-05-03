import ConversationScreen from "@/components/ConversationScreen"
import Sidebar from "@/components/Sidebar"
import { auth, db } from "@/confix/firebase"
import { Conversation, IMessage } from "@/types"
import { generateQueryGetMessages, transformMessages } from "@/utils/getMessagesInConversation"
import { getRecipientEmail } from "@/utils/getRecipientEmail"
import styled from "@emotion/styled"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"


interface Props {
    conversation: Conversation,
    messages: IMessage[] 
}

const StyleContainer = styled.div`
    display: flex;
`
const StyleConversation = styled.div`
    flex-grow: 1;
    height: 100vh;
    overflow: scroll;
    ::-webkit-scrollbar {
    display: none;
    }
    -ms-overflow-style: none;  
    scrollbar-width: none;  
    
` 

const Conversation = ({conversation, messages} : Props) => {
    const [loggedInUser, _loading,_error] = useAuthState(auth)

  return (
    <StyleContainer>
        <Head>
            <title>Conversation with {getRecipientEmail(conversation.users, loggedInUser)}</title>
        </Head>
        <Sidebar/>
        <StyleConversation>
            <ConversationScreen conversation = {conversation} messages = {messages} />
        </StyleConversation>
    </StyleContainer>
  )
}

export default Conversation


export const getServerSideProps: GetServerSideProps<Props, {id: string}> = async (context) => {
    const conversationId = context.params?.id

    const conversationRef = doc(db, 'conversations', conversationId as string)
    const conversationSnapshot = await getDoc(conversationRef)

    //get messages
    const queryMessages = generateQueryGetMessages(conversationId)
    const messagesSnapshot = await getDocs(queryMessages)
    const messages = messagesSnapshot.docs.map( messagesDoc => transformMessages(messagesDoc))

    return {
        props: {
            conversation: conversationSnapshot.data() as Conversation,
            messages
        }
    }
}


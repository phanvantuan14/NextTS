import { useCollection } from 'react-firebase-hooks/firestore';
import { where } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { getRecipientEmail } from './../utils/getRecipientEmail';
import { auth, db } from '@/confix/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppUser, Conversation } from '@/types';

export const useRecipient = (conversationUsers:Conversation['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)

    const queryGetRecipient = query( collection(db, 'users'), where('email', '==', recipientEmail))
    const [recipientsSnapshot, __loading, __error] = useCollection(queryGetRecipient)

    const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined

    return {
        recipient,
        recipientEmail
    }
}
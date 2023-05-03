import { IMessage } from './../types/index';

import { 
    DocumentData,
    query, orderBy, 
    QueryDocumentSnapshot, 
    Timestamp, where,
    collection
} from 'firebase/firestore';
import { db } from '@/confix/firebase';

export const generateQueryGetMessages = (conversationId?: string) => 
    query( 
        collection(db, 'messages'),
        where('conversation_id','==', conversationId),
        orderBy('sent_at', 'asc')
    )


export const transformMessages = (messages: QueryDocumentSnapshot<DocumentData>) => (
    {
        id: messages.id,
        ...messages.data(),
        sent_at: messages.data().sent_at ? 
            convertFirestoreTimesToString((messages.data().sent_at as Timestamp)) : null
    } as IMessage
)

export const convertFirestoreTimesToString = (timestamp : Timestamp) => 
new Date(timestamp.toDate().getTime()).toLocaleString()
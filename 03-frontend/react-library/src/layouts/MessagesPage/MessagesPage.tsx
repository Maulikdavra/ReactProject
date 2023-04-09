import { useState } from 'react';
import { Messages } from './components/Messages';
import { PostNewMessage } from './components/PostNewMessage';

/*
 * MessagesPage component displays the user interface for submitting a question
 * and viewing question-answer response/pending messages.
 *
 * The component imports two other components, PostNewMessage and Messages, to display
 * the corresponding tabs on the UI.
 *
 * The component uses the useState hook to manage the state of messagesClick,
 * which is toggled by clicking the two tabs in the navigation bar.
 *
 * @returns {JSX.Element} Returns a container div with tabs for submitting a question and
 * viewing question-answer response/pending messages.
 */

export const MessagesPage = () => {
    
    const [messagesClick, setMessagesClick] = useState(false);
    
    return (
        <div className='container'>
            <div className='mt-3 mb-2'>
                <nav>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button onClick={() => setMessagesClick(false)} className='nav-link active' 
                            id='nav-send-message-tab' data-bs-toggle='tab' data-bs-target='#nav-send-message' 
                            type='button' role='tab' aria-controls='nav-send-message' aria-selected='true'>
                                Submit Question
                        </button>
                        <button onClick={() => setMessagesClick(true)} className='nav-link' 
                            id='nav-message-tab' data-bs-toggle='tab' data-bs-target='#nav-message' 
                            type='button' role='tab' aria-controls='nav-message' aria-selected='false'>
                                Q/A Response/Pending
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-send-message' role='tabpanel' 
                        aria-labelledby='nav-send-message-tab'>
                           <PostNewMessage/>
                    </div>
                    <div className='tab-pane fade' id='nav-message' role='tabpanel' aria-labelledby='nav-message-tab'>
                        {messagesClick ? <Messages/> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}
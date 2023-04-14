import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import MessageModel from '../../../Models/MessageModel';

/*
 * PostNewMessage component displays a form for submitting a new question to the admin
 * for the authenticated user.
 *
 * The component imports the useOktaAuth hook, useState hook, and MessageModel class.
 *
 * The component uses the useState hook to manage the state of title, question, displayWarning,
 * and displaySuccess, which is used to display the success and error messages on the UI.
 *
 * The component uses the async function submitNewQuestion to send a POST request to the server
 * with the new question data, using the Okta authentication access token.
 *
 * @returns {JSX.Element} Returns a card element that displays a form for submitting a new
 * question to the admin for the authenticated user.
 */

export const PostNewMessage = () => {

    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    /*
     * Below is the async function responsible for submitting an question, iff the user is authenticated.
     * After user submits the questions, we are adding the details of the question to MessageModel.ts(Model folder)
     * The reason behind storing the user question to MessageModel is so that we can later convert into JSON format and send the request to springboot
     * After the submitting question we are setting the questions feilds to null
     */
    async function submitNewQuestion(){
        const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
        if(authState?.isAuthenticated && title !== '' && question !== ''){
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions ={
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestModel)
            };
            const submitNewQuestionResponse = await fetch(url, requestOptions);
            if(!submitNewQuestionResponse.ok){
                throw new Error('Something went wrong!');
            }
            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        }else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    /*
     * Below is the advanced HTML code for displaying a form to submit any questions regarding book to admin
     * The moment user clicks on the submit button, user will be redirect to submitNewQuestion function where the request will be proceess towards springboot and eventually saved in database.
     */
    return (
        <div className='card mt-3'>
            <div className='card-header'>
                Ask question to Luv 2 Read Admin
            </div>
            <div className='card-body'>
                <form method='POST'>
                    {displayWarning &&
                        <div className='alert alert-danger' role='alert'>
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className='alert alert-success' role='alert'>
                            Question added successfully
                        </div>
                    }
                    <div className='mb-3'>
                        <label className='form-label'>
                            Title
                        </label>
                        <input type='text' className='form-control' id='exampleFormControlInput1'
                            placeholder='Title' onChange={e => setTitle(e.target.value)} value={title} />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label'>
                            Question
                        </label>
                        <textarea className='form-control' id='exampleFormControlTextarea1'
                            rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                        </textarea>
                    </div>
                    <div>
                        <button type='button' className='btn btn-primary mt-3' onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
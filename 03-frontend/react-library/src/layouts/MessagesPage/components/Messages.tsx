import { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import MessageModel from "../../../Models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

/*
 * Messages component displays a list of messages, each containing a question and
 * its corresponding answer, if available, for the authenticated user.
 *
 * The component imports the MessageModel, SpinnerLoading, and Pagination components.
 *
 * The component uses the useEffect hook to fetch messages for the authenticated user
 * from the server using the Okta authentication access token.
 *
 * The component uses the useState hook to manage the state of messages, isLoadingMessages,
 * httpError, messagePerPage, currentPage, and totalPages, which is used to display the
 * pagination on the UI.
 *
 * The component uses the paginate function to set the currentPage state when a user clicks
 * on the pagination button.
 *
 * @returns {JSX.Element} Returns a div element that displays a list of messages for the
 * authenticated user, with pagination if necessary.
 */

export const Messages = () => {

    const { authState } = useOktaAuth();
    const [ isLoadingMessages, setIsLoadingMessages ] = useState(true);
    const [ httpError, setHttpError ] = useState(null);

    // Messages
    const [ messages, setMessages ] = useState<MessageModel[]>([]);

    // Pagination
    const [ messagePerPage ] = useState(5);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(0);

    /*
     * Below is the code to fetch all the messages uploaded by admin and other users. 
     * The url in the below is designed in MessageRepository(Springbot)
     */
    useEffect(() => {
        const fetchUserMessages = async () => {
            if(authState && authState?.isAuthenticated){
                const url = `http://localhost:8080/api/messages/search/findByUserEmail/?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage-1}&size=${messagePerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if(!messagesResponse.ok){
                    throw new Error('Something wrong');
                }
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);

        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage])

    if(isLoadingMessages){
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return(
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    /*
     * Below is the customized HTML code specifically designed for fetching all the required information from api response(embedded from useState: message)
     * We have included an React conditional statment where user will be able to see meesages uploaded by admin and if not then a lovely short message.
     */
    return (
        <div className='mt-2'>
            {messages.length > 0 ? 
                <>
                    <h5>Current Q/A: </h5>
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className='card mt-2 shadow p-3 bg-body rounded'>
                                <h5>Case #{message.id}: {message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr/>
                                <div>
                                    <h5>Response: </h5>
                                    {message.response && message.adminEmail ? 
                                        <>
                                            <h6>{message.adminEmail} (admin)</h6>
                                            <p>{message.response}</p>
                                        </>
                                        :
                                        <p><i>Pending response from administration. Please be patient.</i></p>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <h5>All questions you submit will be shown here</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}
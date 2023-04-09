import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";

export const ManageLibraryPage = () => {

    /*
     * Below are some of the states and function where we restricting react to stay focued on one useState at a time.
     */
    const { authState } = useOktaAuth();
    const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] = useState(false);
    const [messageClick, setMessageClick] = useState(false);

    function addBookClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessageClick(false);
    }

    function changeQuantityOfBooksClickFunction(){
        setChangeQuantityOfBooksClick(true);
        setMessageClick(false);
    }

    function messagesClickFunction(){
        setChangeQuantityOfBooksClick(false);
        setMessageClick(true);
    }

    /*
     * The idea behind designing below conditional statment is to give addtional access to only admin users
     * By defining userType == admin, for admin users. A normal user won't be able to access this details without admin credentials.
     * We have defined userType settings in okta developer account.
     * The best way to check if the user's credentials holds this userType property is by navigating to inspected mode -> objects [].
     */
    if(authState?.accessToken?.claims.userType === undefined){
        return <Redirect to="/home"/>
    }

    /*
     * Below is HTML code for interacting with three options from admin pespective: 1: Add new Book, 2: Chnage quantity, 3: Messages
     *
     * 3. Messages: Here we coded the program in such a way that the moment admin clicks on the Message button, AdminMessages.tsx class 
     * will rendered every time admin clicks on the Message button, by this way we are ensuring that Message button carries all the latest
     * messages uploaded by users.
     * 
     */
    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={addBookClickFunction} className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-add-book" type="button" role="tab" aria-controls="nav-add-book"
                            aria-selected="false">
                                Add new book
                        </button>
                        <button onClick={changeQuantityOfBooksClickFunction} className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-quantity" type="button" role="tab" aria-controls="nav-add-book"
                            aria-selected="true">
                                Change quantity
                        </button>
                        <button onClick={messagesClickFunction} className="nav-link" id="nav-messages-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages"
                            aria-selected="false">
                                Messages
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel" aria-labelledby="nav-add-book-tab">
                        Add new book
                    </div>
                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                        {changeQuantityOfBooksClick ? <>Change Quantity</>: <></>}
                    </div>
                    <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                        {messageClick ? <AdminMessages/>: <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Delete
    const [bookDelete, setBookDelete] = useState(false);

    // it executes everytime the data is rendered in our application (every time the state changes)
    useEffect(() => {
        /*
         * The "async" keyword is used to define an asynchronous function, which can be used to perform operations that take some time to 
         * complete, such as making a network request or reading from a file. These functions return a promise, which can be used to handle 
         * the results of the operation once it completes.
         *
         */
        const fetchBooks = async () => {
            const baseUrl: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${bookPerPage}`;
            let url: string = `${baseUrl}?page=${currentPage - 1}&size=${bookPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong, please try again later!');
            }

            // if API is fetched successfully then we are capturing response in JSON format
            const responsejson = await response.json();

            // all the JSON data from API are alined in '_embedded' field (run springboot applicaton & check URL in browser)
            const responseData = responsejson._embedded.books;

            setTotalAmountOfBooks(responsejson.page.totalElements);
            setTotalPages(responsejson.page.totalPages);

            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);

            /*
             * "setIsLoading(false)" is typically used in a React component to indicate that data has been successfully fetched from an API 
             * and the component can now render the data. The "isLoading" state is usually set to "true" before the data fetching is 
             * initiated, and then set to "false" when the data fetching is completed. This is done to ensure that the component does not 
             * try to render the data before it is available, which can cause errors or unexpected behavior.
             *
             */

            setIsLoading(false);


        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage, bookDelete]);

    const indexOfLastBook: number = currentPage * bookPerPage;
    const indexOfFirstBook: number = indexOfLastBook - bookPerPage;
    let lastItem = bookPerPage * currentPage <= totalAmountOfBooks ? bookPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return(
        <div className="container mt-5">
            {totalAmountOfBooks > 0 ?
             <>
                <div className="mt-3">
                    <h3>Number of result: ({totalAmountOfBooks})</h3>
                </div>
                <p>
                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                </p>
                {books.map(book => (
                    <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook}/>
                ))}
             </>
             :
             <h5>Add a book before modifiying quantity of any books</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}
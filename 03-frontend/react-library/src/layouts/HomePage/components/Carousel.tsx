import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../Models/BookModel";

export const Carousel = () => {

    const [Books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // it executes everytime the data is rendered in our application (every time the state changes)
    useEffect(() => {
        /*
         * The "async" keyword is used to define an asynchronous function, which can be used to perform operations that take some time to 
         * complete, such as making a network request or reading from a file. These functions return a promise, which can be used to handle 
         * the results of the operation once it completes.
         *
         */
        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8080/api/books";
            const url: string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url);

            if (!response.ok) { 
                throw new Error('Something went wrong, please try again later!');
            }

            // if API is fetched successfully then we are capturing response in JSON format
            const responsejson = await response.json();

            // all the JSON data from API are alined in '_embedded' field (run springboot applicaton & check URL in browser)
            const responseData = responsejson._embedded.books;

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

    }, []);

    if (isLoading) { 
        return (
            <div className=" container m-5">
                <p>Loading..</p>
            </div>
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title'>
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {Books.slice(0, 3).map(book => (
                                /* 
                                 * {book} on below line holds all the information about the book like img, title, author and {book} variable
                                 * is created in ReturnBook component, basically {book} fetches informaiton from API with the help of props 
                                 * used in ReturnBook component
                                 */
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {Books.slice(3, 6).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {Books.slice(6, 9).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnBook book={Books[7]} key={Books[7].id}/>
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <a className='btn btn-outline-secondary btn-lg' href='#'>View More</a>
            </div>
        </div>
    );
}
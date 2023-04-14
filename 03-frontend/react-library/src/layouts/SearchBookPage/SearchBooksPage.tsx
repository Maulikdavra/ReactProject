import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book Category'); // 'Book Category' will displayed in drop-down menu


    // it executes everytime the data is rendered in our application (every time the state changes)
    useEffect(() => {
        /*
         * The "async" keyword is used to define an asynchronous function, which can be used to perform operations that take some time to 
         * complete, such as making a network request or reading from a file. These functions return a promise, which can be used to handle 
         * the results of the operation once it completes.
         *
         */
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API}/books`;
            let url: string = `${baseUrl}?page=${currentPage - 1}&size=${bookPerPage}`;

            if (searchUrl == '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${bookPerPage}`;
            } else {
                url = baseUrl + searchUrl;
            }

            const response = await fetch(url);

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

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

    const searchHandleChange = () => {
        if (search === '') {
            setSearchUrl('')
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=0&size=${bookPerPage}`)
        }
    }

    const categoryField = (value: string) => {
        if (
            value.toLowerCase() === 'fe' ||
            value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'data' ||
            value.toLowerCase() === 'devops' 
            ){
                setCategorySelection(value);
                setSearchUrl(`/search/findByCategory?category=${value}&page=0&size=${bookPerPage}`)
            }else{
                setCategorySelection('All');
                setSearchUrl(`?page=0size=${bookPerPage}`)
            }
    }

    const indexOfLastBook: number = currentPage * bookPerPage;
    const indexOfFirstBook: number = indexOfLastBook - bookPerPage;
    let lastItem = bookPerPage * currentPage <= totalAmountOfBooks ? bookPerPage * currentPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type="search"
                                    placeholder="Search" aria-labelby="Search"
                                    onChange={e => setSearch(e.target.value)} />
                                <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {categorySelection} {/*'Book Category' will displayed in drop-down menu*/}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => categoryField('All')}>
                                        <a className="dropdown-item" href="#">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('FE')}>
                                        <a className="dropdown-item" href="#">
                                            Front End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('BE')}>
                                        <a className="dropdown-item" href="#">
                                            Back End
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Data')}>
                                        <a className="dropdown-item" href="#">
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Devops')}>
                                        <a className="dropdown-item" href="#">
                                            DevOps
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        totalAmountOfBooks > 0 ?
                            <>
                                <div className="mt-3">
                                    <h5>Number of result: ({totalAmountOfBooks})</h5>
                                </div>
                                <p>
                                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                                </p>
                                {books.map(book => (
                                    <SearchBook book={book} key={book.id} />
                                ))}
                            </>
                            :
                            <div className="m-5">
                                <h3>
                                    Can't find what you looking for?
                                </h3>
                                <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                                    href="#">Library Services</a>
                            </div>
                    }

                    {/* If totalPages are > 1 then React will render Pagination component */}
                    {
                        totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}
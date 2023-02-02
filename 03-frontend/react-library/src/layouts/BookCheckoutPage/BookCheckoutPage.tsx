import { useEffect, useState } from "react";
import BookModel from "../../Models/BookModel";
import ReviewModel from "../../Models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReviews } from "../Utils/StarsReviews";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Review  state
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStar, setTotalStar] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Below line will grab the third index from the url;  basically anything after "checkout/..."
    const bookId = (window.location.pathname).split('/')[2];

    // it executes everytime the data is rendered in our application (every time the state changes)
    useEffect(() => {
        /*
         * The "async" keyword is used to define an asynchronous function, which can be used to perform operations that take some time to 
         * complete, such as making a network request or reading from a file. These functions return a promise, which can be used to handle 
         * the results of the operation once it completes.
         *
         */
        const fetchBook = async () => {

            // The reason behind creating baseURL path starting with port 8080 is beacause the data is coming from backened
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong, please try again later!');
            }

            // if API is fetched successfully then we are capturing response in JSON format
            const responsejson = await response.json();

            const loadedBooks: BookModel = {
                id: responsejson.id,
                title: responsejson.title,
                author: responsejson.author,
                description: responsejson.description,
                copies: responsejson.copies,
                copiesAvailable: responsejson.copiesAvailable,
                category: responsejson.category,
                img: responsejson.img,
            };

            setBook(loadedBooks);

            /*
             * "setIsLoading(false)" is typically used in a React component to indicate that data has been successfully fetched from an API 
             * and the component can now render the data. The "isLoading" state is usually set to "true" before the data fetching is 
             * initiated, and then set to "false" when the data fetching is completed. This is done to ensure that the component does not 
             * try to render the data before it is available, which can cause errors or unexpected behavior.
             *
             */

            setIsLoading(false);


        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, []);

    useEffect(() => {
        const fetchBookReviews = async () => {

            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);
            if (!responseReviews.ok) {
                throw new Error('Something went wrong, Sorry!')
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];
            let weightStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightStarReviews = weightStarReviews + responseData[key].rating;
            }
            if (loadedReviews) {
                const round = (Math.round((weightStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStar(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    if (isLoading || isLoadingReview) {
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

    return (
        <div>
            {/* Web Version */}
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }

                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReviews Rating={4.5} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobil={false} />
                </div>
                <hr />
                <LatestReviews reviews={[]} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile Version */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center alighn-items-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReviews Rating={4} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobil={true} />
                <hr />
                <LatestReviews reviews={[]} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}
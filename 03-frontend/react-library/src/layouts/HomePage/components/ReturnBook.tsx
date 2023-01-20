import React from 'react'
import BookModel from '../../../Models/BookModel';

export const ReturnBook: React.FC<{ book: BookModel }> = (props) => {
    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-center'>

                // basically the the logic here is that if props.book.img is true then display image on line 12-15 or else display image that is on line 14-17
                {props.book.img ?
                    <img
                        src={require(props.book.img)}
                        width='151'
                        height='233'
                        alt="book"
                    />
                    :
                    <img
                        src={require('./../../../Images/BooksImages/book-luv2code-1000.png')}
                        width='151'
                        height='233'
                        alt="book"
                    />
                }

                <h6 className='mt-2'>{props.book.title}</h6>
                <p>{props.book.author}</p>
                <a className='btn main-color text-white' href='#'>Reserve</a>
            </div>
        </div>
    );
}
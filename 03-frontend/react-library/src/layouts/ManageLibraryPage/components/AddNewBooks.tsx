import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import AddBookRequest from '../../../Models/AddBookRequest';

/*
 * This component handles the form for adding a new book to the library.
 * The form includes fields for book title, author, description, category, and number of copies, as well as an optional image upload field.
 * The category field is a dropdown menu that allows the user to select from several predefined categories.
 * The component uses state variables to track the input values and display success or warning messages as needed.
 * When the "Add Book" button is clicked, the component should send a POST request to the backend API to add the new book to the database.
 */
export const AddNewBook = () => {

    const { authState } = useOktaAuth();

    // New Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any>(null);

    // Displays
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    /*
     * Overall, the below functions(function and getBase64) are used for converting an uploaded image to a base64-encoded string, 
     * which can then be sent to a server for further processing or storage.
     */

    async function base64ConversionForImages(e: any){
        if(e.target.files[0]) {
            getBase64(e.target)
        }
    }

    /*
     * The getBase64 function expects a file as a parameter, and it converts the file to a base64-encoded string using the FileReader API provided by the browser. 
     * It sets the base64-encoded string as the selected image using the setSelectedImage function.
     * When the FileReader has finished reading the file, it calls onload function which sets the result of the read operation (the base64-encoded string) to setSelectedImage. 
     * If there is an error while reading the file, the onerror function is called, and it logs the error to the console.
     */
    function getBase64(file: any){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setSelectedImage(reader.result);
        };
        reader.onerror = function (error) {
            console.log('Error', error);
        }
    }

    /*
     * Below async function: submitNewBook is designed to submit a new book data to springboot,
     * Model: AddBookRequest is used to hold the data coming form react and later sent to springboot for upadting the database record.
     * After submitting a successful request we are setting all the required feilds to null/empty.
     */
    async function submitNewBook(){
        const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;
        if(authState?.isAuthenticated && title !== '' && author !== '' && category !== 'Category' && description !== '' && copies >= 0){
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
            book.img = selectedImage;
            const requestOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            };
            const submitNewBookResponse = await fetch(url, requestOptions);
            if(!submitNewBookResponse.ok){
                throw new Error('Something went wrong');
            }
            setTitle('');
            setAuthor('');
            setDescription('');
            setCategory('Category');
            setCopies(0);
            setSelectedImage(null);
            setDisplayWarning(false);
            setDisplaySuccess(true);
        }else{
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    /*
     * Below code displays a form to add a new book to the library system. 
     * The form includes fields for title, author, category, description, and number of copies. 
     * It also allows users to select an image of the book cover. 
     * The form contains validation for mandatory fields and displays alerts for errors and successful addition of the book. 
     * Overall, this code provides a user-friendly interface for adding new books to the library system.
     */
    return (
        <div className='container mt-5 mb-5'>
            {displaySuccess && 
                <div className='alert alert-success' role='alert'>
                    Book added successfully
                </div>
            }
            {displayWarning && 
                <div className='alert alert-danger' role='alert'>
                    All fields must be filled out
                </div>
            }
            <div className='card'>
                <div className='card-header'>
                    Add a new book
                </div>
                <div className='card-body'>
                    <form method='POST'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Title</label>
                                <input type="text" className='form-control' name='title' required 
                                    onChange={e => setTitle(e.target.value)} value={title} />
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Author </label>
                                <input type="text" className='form-control' name='author' required 
                                    onChange={e => setAuthor(e.target.value)} value={author}/>
                            </div>
                            <div className='col-md-3 mb-3'>
                                <label className='form-label'> Category</label>
                                <button className='form-control btn btn-secondary dropdown-toggle' type='button' 
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'>
                                        {category}
                                </button>
                                <ul id='addNewBookId' className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li><a onClick={() => categoryField('FE')} className='dropdown-item'>Front End</a></li>
                                    <li><a onClick={() => categoryField('BE')} className='dropdown-item'>Back End</a></li>
                                    <li><a onClick={() => categoryField('Data')} className='dropdown-item'>Data</a></li>
                                    <li><a onClick={() => categoryField('DevOps')} className='dropdown-item'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-12 mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' id='exampleFormControlTextarea1' rows={3} 
                                onChange={e => setDescription(e.target.value)} value={description}></textarea>
                        </div>
                        <div className='col-md-3 mb-3'>
                            <label className='form-label'>Copies</label>
                            <input type='number' className='form-control' name='Copies' required 
                                onChange={e => setCopies(Number(e.target.value))} value={copies}/>
                        </div>
                        <input type='file' onChange={e => base64ConversionForImages(e)}/>
                        <div>
                            <button type='button' className='btn btn-primary mt-3' onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
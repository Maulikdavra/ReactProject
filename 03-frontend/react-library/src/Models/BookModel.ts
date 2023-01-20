/*
 * The reason behind creating below class is that, we are fetching data from API (springboot)
 * we need a class in TypeScript where we can hold all the information about data (images)
 *  
 */     


class BookModel{
    id: number;
    title: string;
    author?: string; // "?" means this variable can be null
    description?: string;
    copies?: number;
    copiesAvailable?: string;
    category?: string;
    img?: string;

    constructor(id: number, title: string, author: string,  description: string, 
                copies: number, copiesAvailable: string, category: string, img: string){
                    this.id = id;
                    this.title = title;
                    this.author = author;
                    this.description = description;
                    this.copies = copies;
                    this.copiesAvailable = copiesAvailable;
                    this.category = category;
                    this.img = img;
                }
}

export default BookModel;
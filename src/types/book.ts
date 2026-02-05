export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  publishDate: string;
  publisherName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description: string;
  publishDate: string;
  publisherName: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface BooksResponse {
  status: string;
  results: number;
  data: Book[];
}

export interface SingleBookResponse {
  status: string;
  data: Book;
}

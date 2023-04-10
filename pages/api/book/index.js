import Book from "@/models/Book";
import connectDb from "@/utils/connectDb";

export default async function handler(req, res) {
  await connectDb();

  // Get all books
  if (req.method === "GET") {
    const books = await Book.find();
    console.log(books);
    return res.status(200).json({ success: true, data: books });
  }

  // Create a book
  if (req.method === "POST") {
    const book = await Book.create(req.body);
    return res.status(201).json({ success: true, data: book });
  }

  return res.status(404).json({ success: false, message: "Unhandled method" });
}

import Book from "@/models/Book";
import connectDb from "@/utils/connectDb";

export default async function handler(req, res) {
  await connectDb();

  // Get a book
  if (req.method === "GET") {
    const book = await Book.findById(req.query.id);
    if (!book)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    return res.status(200).json({ success: true, data: book });
  }

  // Update a book
  if (req.method === "PUT") {
    const updatedBook = await Book.findByIdAndUpdate(
      req.query.id,
      {
        $set: req.body, // $set sadece değişen alanları günceller
      },
      {
        new: true, // update edilmiş kitabı getir
      }
    );
    if (!updatedBook)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    return res.status(200).json({ success: true, data: updatedBook });
  }

  // Delete a book
  if (req.method === "DELETE") {
    const deletedBook = await Book.findByIdAndDelete(req.query.id);
    if (!deletedBook)
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    return res.status(204).json({ success: true });
  }

  return res.status(404).json({ success: false, message: "Unhandled method" });
}

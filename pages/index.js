import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const getAllBooks = useQuery({
    queryKey: ["books"], // cache içinde tutulması için isim veriyoruz
    queryFn: () => axios.get("/api/book").then((res) => res.data),
  });

  const createBook = useMutation({
    mutationFn: (fields) => axios.post("/api/book", fields),
    onSuccess: () => {
      // kitabı oluşturma başarılı olursa burası çalışacak
      // cache i güncelle
      queryClient.refetchQueries(["books"]);
      // formu resetle
      reset();
    },
    onError: (error) => {
      // kitap oluşturulurken hata olursa burası çalışacak
      console.log(error);
    },
  });

  const deleteBook = useMutation({
    mutationFn: (id) => axios.delete(`/api/book/${id}`),
    onSuccess: () => {
      // cache i tekrar güncelle
      queryClient.refetchQueries(["books"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (fields) => createBook.mutate(fields);

  const onDelete = (id) => deleteBook.mutate(id);

  if (getAllBooks.isLoading) return "loading...";

  if (getAllBooks.error) return getAllBooks.error.message;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="title" {...register("title")} />
        <input type="text" placeholder="author" {...register("author")} />
        <button>create book</button>
      </form>
      <hr />
      <ul>
        {getAllBooks?.data?.data?.map((book) => (
          <li key={book._id}>
            <h1>Title: {book.title}</h1>
            <h3>Author: {book.author}</h3>
            <button onClick={() => router.push(`/book/${book._id}`)}>
              view book
            </button>
            <button onClick={() => router.push(`/book/edit/${book._id}`)}>
              edit book
            </button>
            <button onClick={() => onDelete(book._id)}>delete book</button>
          </li>
        ))}
      </ul>
    </>
  );
}

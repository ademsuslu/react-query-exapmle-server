import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";

const BookEdit = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const getBook = useQuery({
    queryKey: ["book"],
    queryFn: () =>
      axios.get(`/api/book/${router.query.id}`).then((res) => res.data),
    enabled: Boolean(router.query.id), // sayfa yüklendiğinde react.query sonradan geliyor ondan fonksiyon çalışmıyor, bunu ekleyerek query.id varsa çalış diyoruz aynı use effectin dependency arrayi gibi
  });

  const updateBook = useMutation({
    mutationFn: (fields) => axios.put(`/api/book/${router.query.id}`, fields),
    onSuccess: () => {
      queryClient.refetchQueries(["book"]); // update olan kitabı güncelle cache içinde
      router.push("/");
    },
    onError: (error) => console.log(error),
  });

  const onSubmit = (fields) => updateBook.mutate(fields);

  if (getBook.isLoading) return "loading...";

  if (getBook.error) return getAllBooks.error.message;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="title"
          defaultValue={getBook.data.data.title}
          disabled={updateBook.isLoading}
          {...register("title")}
        />
        <input
          type="text"
          placeholder="author"
          defaultValue={getBook.data.data.author}
          disabled={updateBook.isLoading}
          {...register("author")}
        />
        <button disabled={updateBook.isLoading}>update book</button>
      </form>
    </div>
  );
};

export default BookEdit;

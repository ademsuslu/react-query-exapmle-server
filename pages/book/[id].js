import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";

const BookDetail = () => {
  const router = useRouter();

  const getBook = useQuery({
    queryKey: ["book"],
    queryFn: () =>
      axios.get(`/api/book/${router.query.id}`).then((res) => res.data),
    enabled: Boolean(router.query.id), // sayfa yüklendiğinde react.query sonradan geliyor ondan fonksiyon çalışmıyor, bunu ekleyerek query.id varsa çalış diyoruz aynı use effectin dependency arrayi gibi
  });

  if (getBook.isLoading) return "loading...";

  if (getBook.error) return getBook.error.message;

  return (
    <div>
      <h1>Title: {getBook?.data?.data?.title}</h1>
      <h1>Author: {getBook?.data?.data?.author}</h1>
    </div>
  );
};

export default BookDetail;

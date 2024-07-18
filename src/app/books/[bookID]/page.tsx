interface BookProps {
  params: {
    bookID: number
  }
}
const BookPage = ({params: {bookID}}: BookProps) => {
  console.log(bookID)
  return (
    <div>BookPage</div>
  )
}

export default BookPage
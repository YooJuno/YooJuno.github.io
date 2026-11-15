function BlogDates({ date, updated }) {
  return (
    <span className="post-dates">
      <span className="post-date">작성 <time dateTime={date}>{date}</time></span>
      {updated && updated !== date && (
        <span className="post-date">최종 수정 <time dateTime={updated}>{updated}</time></span>
      )}
    </span>
  )
}

export default BlogDates

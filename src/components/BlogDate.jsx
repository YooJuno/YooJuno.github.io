function BlogDate({ date }) {
  return <span className="post-date">작성 <time dateTime={date}>{date}</time></span>
}

export default BlogDate

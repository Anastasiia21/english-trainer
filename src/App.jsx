import { useEffect, useState } from 'react'

function shuffleArray(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export default function App() {
  const [words, setWords] = useState([])
  const [index, setIndex] = useState(0)
  const [showEnglish, setShowEnglish] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/words.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить words.json')
        }
        return response.json()
      })
      .then((data) => {
        setWords(shuffleArray(data))
        setIndex(0)
        setShowEnglish(true)
      })
      .catch((loadError) => setError(loadError.message))
  }, [])

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredWords = normalizedSearchQuery
    ? words.filter((word) => {
        return (
          word.en.toLowerCase().includes(normalizedSearchQuery) ||
          word.ru.toLowerCase().includes(normalizedSearchQuery)
        )
      })
    : words
  const currentWord = filteredWords[index]

  function next() {
    if (filteredWords.length === 0) {
      return
    }

    setShowEnglish(true)
    setIndex((previous) => (previous + 1) % filteredWords.length)
  }

  function previous() {
    if (filteredWords.length === 0) {
      return
    }

    setShowEnglish(true)
    setIndex((previous) => (previous - 1 + filteredWords.length) % filteredWords.length)
  }

  function searchWords(event) {
    event.preventDefault()
  }

  if (error) {
    return <main className="page error">{error}</main>
  }

  if (words.length === 0) {
    return <main className="page loading">Загрузка...</main>
  }

  return (
    <main className="page">
      <header className="header">
        <h1>English Trainer</h1>
        <p className="counter">
          {currentWord ? index + 1 : 0} / {filteredWords.length}
        </p>
      </header>

      <section className="trainer">
        <form className="search-form" onSubmit={searchWords}>
          <input
            type="search"
            value={searchQuery}
            placeholder="Search words..."
            aria-label="Search words"
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setIndex(0)
              setShowEnglish(true)
            }}
          />
        </form>

        {currentWord ? (
          <button className="card" type="button" onClick={() => setShowEnglish((value) => !value)}>
            <span className="word">{showEnglish ? currentWord.en : currentWord.ru}</span>
          </button>
        ) : (
          <div className="card empty-card">
            <span className="word">No words found</span>
          </div>
        )}

        {currentWord && (
          <div className="buttons">
            <button type="button" onClick={previous}>Назад</button>
            <button type="button" className="primary" onClick={() => setShowEnglish((value) => !value)}>
              Перевернуть
            </button>
            <button type="button" onClick={next}>Дальше</button>
          </div>
        )}
      </section>
    </main>
  )
}

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
  const [showEnglish, setShowEnglish] = useState(false)
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
        setShowEnglish(false)
      })
      .catch((loadError) => setError(loadError.message))
  }, [])

  const currentWord = words[index]

  function next() {
    setShowEnglish(false)
    setIndex((previous) => (previous + 1) % words.length)
  }

  function previous() {
    setShowEnglish(false)
    setIndex((previous) => (previous - 1 + words.length) % words.length)
  }

  if (error) {
    return <main className="page error">{error}</main>
  }

  if (!currentWord) {
    return <main className="page loading">Загрузка...</main>
  }

  return (
    <main className="page">
      <header className="header">
        <h1>English Trainer</h1>
        <p className="counter">
          {index + 1} / {words.length}
        </p>
      </header>

      <section className="trainer">
        <button className="card" type="button" onClick={() => setShowEnglish((value) => !value)}>
          <span className="label">{showEnglish ? 'English' : 'Русский'}</span>
          <span className="word">{showEnglish ? currentWord.en : currentWord.ru}</span>
        </button>

        <div className="buttons">
          <button type="button" onClick={previous}>Назад</button>
          <button type="button" className="primary" onClick={() => setShowEnglish((value) => !value)}>
            Перевернуть
          </button>
          <button type="button" onClick={next}>Дальше</button>
        </div>
      </section>
    </main>
  )
}

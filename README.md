# English Trainer

Простой тренажёр английских слов и фраз.

## Как работает

- На первой стороне карточки показывается русский текст.
- На второй стороне показывается английский перевод.
- Все данные лежат в `public/words.json` в едином списке.
- Новые слова/фразы можно добавлять через `new_words.txt` прямо из GitHub app на телефоне.
- GitHub Actions раз в час запускает `import_new_words.py`, переносит новые строки в `public/words.json` и пушит коммит.

## Формат `new_words.txt`

```txt
кошка - cat
добрый вечер - good evening
я хочу кофе: I want coffee
```

Пустые строки и строки с `#` игнорируются и остаются в файле.

## Локальный запуск

```bash
npm install
npm run dev
```

## Проверки

```bash
npm run test:import
npm run lint
npm run build
```

# 🌊 parallelo

> A minimal utility to process arrays with controlled concurrency. Handles both sync and async functions, while collecting results and errors.

---

## ✨ Features

- ✅ Run tasks concurrently with a custom limit
- ✅ Supports both async and sync functions
- ✅ Captures both **successful results** and **errors**
- ✅ Maintains input association with each result/error

---

## 📦 Installation

```bash
npm install parallelo
```

## Usage

Basic example

```
import parallelo from 'parallelo';

const items = [1, 2, 3, 4, 5];

const { results, errors } = await parallelo(
  items,
  2, // concurrency limit
  async (item) => {
    if (item === 3) throw new Error('Item 3 failed');
    return item * 2;
  }
);

console.log('✅ Results:', results);
console.log('❌ Errors:', errors);
```

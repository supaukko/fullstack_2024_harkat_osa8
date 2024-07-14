# fullstack_2024_harkat_osa8

## [tehtävät 8.8 - 8.12](https://fullstackopen.com/osa8/react_ja_graph_ql#tehtavat-8-8-8-12)

Backend

```
nmp init
npm install @apollo/server graphql winston
npm install --save-dev nodemon
npm install uuid

```

Frontend

```
npm install react-router-dom
```

Suoritetaan kyselyt palvelimella Apollo Studio Explorer-näkymässä: http://localhost:4000/

### Tehtävät 8.1

```
query t8_1 {
  bookCount,
  authorCount
}

```

### Tehtävät 8.2

```
query t8_2 {
  allBooks { 
    title
    author
    published 
    genres
  }
}
```


### Tehtävät 8.3

```
query t8_3 {
  allAuthors {
    name
    bookCount
    born
  }
}
```

### Tehtävät 8.4

```
query t8_4 {
  allBooks (author: "Fyodor Dostoevsky") { 
    title
  }
}
```

### Tehtävät 8.5

```
query t8_5 {
  allBooks (author: "Robert Martin", genre: "refactoring") { 
    title
    author
  }
}

```

### Tehtävät 8.6
```
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}

mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}
```

### Tehtävät 8.7
```
mutation {
  editAuthor(
    name: "Reijo Mäki",
    setBornTo: 1958) {
      name
      born
  }
}

mutation {
  editAuthor(
    name: "Reijo Mäki2",
    setBornTo: 1958) {
      name
      born
  }
}
```

### Tehtävät 8.12
npm install react-select
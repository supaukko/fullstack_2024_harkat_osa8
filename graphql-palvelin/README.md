# fullstack_2024_harkat_osa8

## [Tehtävät 8.1.-8.7](https://fullstackopen.com/osa8/graph_ql_palvelin#tehtavat-8-1-8-7)


```
nmp init
npm install @apollo/server graphql
npm install --save-dev nodemon
npm install uuid

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

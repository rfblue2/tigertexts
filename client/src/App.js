import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = { books: [] }

  componentDidMount() {
    fetch('/api/books')
      .then(res => res.json())
      .then(books=> this.setState({ books: books.data }));
  }

  render() {
    return (
      <div className="App">
        <h1>Textbooks</h1>
        {this.state.books.map(book =>
          <div key={book.id}>{book.attributes.title}</div>)}
      </div>
    );
  }
}

export default App;

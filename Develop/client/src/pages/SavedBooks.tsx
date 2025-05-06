import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';

const SavedBooks = () => {
  // Fetch user data using useQuery
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Extract userData and savedBooks from query result
  const userData = data?.me;
  const savedBooks: { bookId: string; title: string; authors: string[]; description: string; image?: string }[] = userData?.savedBooks || [];

  // Handle book removal
  const handleDeleteBook = async (bookId: string) => {
    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      if (data) {
        // After successful deletion, update state or UI (e.g., removing book from savedBooks)
        console.log('Book removed from saved list');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h1>Your Saved Books</h1>
      <Row>
        {savedBooks.length ? (
          savedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={book.title} variant="top" />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Remove this Book
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No saved books yet!</p>
        )}
      </Row>
    </Container>
  );
};

export default SavedBooks;

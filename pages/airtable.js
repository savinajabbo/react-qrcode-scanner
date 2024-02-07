import React, { useEffect, useState } from 'react';
import Airtable from 'airtable';

const MyComponent = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Create a new instance of Airtable with your API key
    const base = new Airtable({
      apiKey: 'patY9i30BliQovXfx.43d013236aa46c9dbd3bb38f5d6ed23f117b3c86eae1afe0d167c23d2fa0b472'
    }).base('app4WOeGbjWwvZuGp');

    // Define the Airtable query
    base('Attendees').select({
      view: 'All Responses'
    }).eachPage(
      // Success callback
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const recordEmail = record.get('Email');

          // Compare the email from the record with the input email
          if (recordEmail === email) {
            const name = record.get('Name');
            console.log(`Found matching record! Name: ${name}, Email: ${recordEmail}`);
          }
        });

        fetchNextPage(); // Fetch the next page of records
      },
      // Error callback
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Data retrieval completed successfully.');
      }
    );
  }, [email]); // The effect will re-run whenever the 'email' state changes

  return (
    <div>
      {/* Input field for email */}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />

      {/* Your component JSX */}
    </div>
  );
};

export default MyComponent;

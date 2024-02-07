import React, { useEffect } from 'react';
import Airtable from 'airtable';

const MyComponent = () => {
  useEffect(() => {
    // Create a new instance of Airtable with your API key
    const base = new Airtable({
      apiKey: 'patY9i30BliQovXfx.43d013236aa46c9dbd3bb38f5d6ed23f117b3c86eae1afe0d167c23d2fa0b472'
    }).base('app4WOeGbjWwvZuGp');

    // Define the Airtable query
    base('Attendees').select({
      maxRecords: 3,
      view: 'All Responses'
    }).eachPage(
      // Success callback
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          console.log('Retrieved', record.get('Name'));
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
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};

export default MyComponent;

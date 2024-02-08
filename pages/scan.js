import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import styles from "../styles/Home.module.css";
import Airtable from 'airtable';

const successMessages = [
  "Welcome to the Summit",
  "You are checked in",
  "Welcome"
];
 
export default function Scan() {
  const [data, setData] = useState("No result");
  const [showMessages, setShowMessages] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [name, setName] = useState('');
  let scannedName = '';

  // Declare handleScanResult outside of useEffect
  const handleScanResult = (result, error) => {
    if (!!result) {
      setData(result.text);
      const [name, place] = result.text.split('|');
      console.log("Scanned Name:", name);
      scannedName = name; // Update the global variable with the scanned name
      setName(name);
      console.log("Name state:", scannedName);
      setShowMessages(true);
    }

    if (!!error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (showMessages) {
      // set a timeout to hide the messages after 8 seconds
      const timeoutId = setTimeout(() => {
        setShowMessages(false);
        // Increment the index to display the next message on the next scan
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % successMessages.length);
      }, 4000);

      // clear the timeout when the component is unmounted or data changes
      return () => clearTimeout(timeoutId);
    }

    // create a new instance of Airtable
    const base = new Airtable({
      apiKey: 'patY9i30BliQovXfx.43d013236aa46c9dbd3bb38f5d6ed23f117b3c86eae1afe0d167c23d2fa0b472'
    }).base('app4WOeGbjWwvZuGp');

    // define the Airtable query
    base('Attendees').select({
      view: 'All Responses'
    }).eachPage(
      // success callback
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          const recordName = record.get('Name');
          console.log("Comparing:", recordName, scannedName);


          // compare the name from the record with the input name (from qr code)
          if (recordName === name) {
            const checked = record.get('Checked-In');
            // Update the CheckedIn field
            record.update({
              "Checked-In": true
            }, 
            function(err, updatedRecord) {
              if (err) {
                console.error(err);
              } else {
                console.log("Record updated:", updatedRecord.get('Name'));
              }
            });
          }
        });

        fetchNextPage(); // fetch the next page of records
      },
      // error callback
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
    
  }, [showMessages, data]);

  const renderResult = () => {
    if (data !== "No result" && showMessages) {
      const [name, place] = data.split('|');
      return (
        <div>
          <h2 className={styles.welcome}>{successMessages[currentMessageIndex]},<br /> {name}!</h2>
          <h3 className={styles.place}>From {place}.</h3>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.container}>
        <div className={styles.img} style={{ backgroundImage: `url(pics/sum-bg.png)` }}>
          <QrReader className={styles.scanner}
            onResult={handleScanResult}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%", height: "20%" }}
          />
        </div>
        {renderResult()}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import './SeatMap.css';

const SeatMap = () => {
  const [seatMap, setSeatMap] = useState(null);

  useEffect(() => {
    fetch('/api/seatmap')
      .then(res => res.json())
      .then(data => {
        const cabin = data.seatsItineraryParts[0].segmentSeatMaps[0].passengerSeatMaps[0].seatMap.cabins[0];
        setSeatMap(cabin);
      });
  }, []);

  if (!seatMap) return <div>Loading...</div>;

  return (
    <div className="seat-map-container">
      <h2>Seat Map - Deck: {seatMap.deck}</h2>
      <div className="seat-columns">
        {seatMap.seatColumns.map((col, i) => (
          <div key={i} className="seat-header">{col}</div>
        ))}
      </div>
      {seatMap.seatRows.map((row, i) => (
        <div key={i} className="seat-row">
          {row.seats.map((seat, j) => {
            const isSeat = seat.storefrontSlotCode === 'SEAT';
            const classNames = ['seat-slot'];
            if (!isSeat) classNames.push('slot-non-seat');
            else if (!seat.available) classNames.push('seat-taken');
            else classNames.push('seat-available');

            return (
              <div key={j} className={classNames.join(' ')}>
                {isSeat ? (
                  <>
                    <div>{seat.code}</div>
                    <div>{seat.total?.alternatives[0][0].amount} {seat.total?.alternatives[0][0].currency}</div>
                  </>
                ) : seat.storefrontSlotCode}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;

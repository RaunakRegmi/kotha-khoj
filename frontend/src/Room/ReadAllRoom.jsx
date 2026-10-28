import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../constant";
import RoomCard from "./RoomCard";

const ReadAllRoom = () => {
  let [rooms, setRooms] = useState([]);
  let [loading, setLoading] = useState(true);

  // search form
  let [location, setLocation] = useState("");
  let [roomType, setRoomType] = useState("");
  let [minRent, setMinRent] = useState("");
  let [maxRent, setMaxRent] = useState("");
  let [sort, setSort] = useState("");

  let getRooms = async (query) => {
    try {
      // params => /room?location=...&roomType=...
      let result = await axios({
        url: `${apiUrl}/room`,
        method: "get",
        params: query,
      });
      setRooms(result.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load rooms.");
    }
    setLoading(false);
  };

  // load all rooms on page open
  useEffect(() => {
    getRooms({});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // only send filters that are filled
    let query = {};
    if (location) query.location = location;
    if (roomType) query.roomType = roomType;
    if (minRent) query.minRent = minRent;
    if (maxRent) query.maxRent = maxRent;
    if (sort) query.sort = sort;
    setLoading(true);
    getRooms(query);
  };

  const handleReset = () => {
    setLocation("");
    setRoomType("");
    setMinRent("");
    setMaxRent("");
    setSort("");
    setLoading(true);
    getRooms({});
  };

  return (
    <div>
      <div className="hero">
        <h1>Find your next room</h1>
        <p>Rooms and flats for rent, posted directly by owners.</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Location (e.g. Baneshwor)"
          onChange={(e) => setLocation(e.target.value)}
          value={location}
        />
        <select onChange={(e) => setRoomType(e.target.value)} value={roomType}>
          <option value="">All types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="flat">Flat</option>
          <option value="apartment">Apartment</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min rent"
          onChange={(e) => setMinRent(e.target.value)}
          value={minRent}
        />
        <input
          type="number"
          min="0"
          placeholder="Max rent"
          onChange={(e) => setMaxRent(e.target.value)}
          value={maxRent}
        />
        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="">Newest first</option>
          <option value="rent">Rent: low to high</option>
          <option value="-rent">Rent: high to low</option>
        </select>
        <button className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-light" onClick={handleReset}>
          Reset
        </button>
      </form>

      {loading ? (
        <p className="center-box muted">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="center-box">
          <h3>No rooms found</h3>
          <p className="muted">Try a different location or rent range.</p>
        </div>
      ) : (
        <>
          <p className="muted">{rooms.length} room(s) found</p>
          <div className="room-grid">
            {rooms.map((room) => {
              return <RoomCard key={room._id} room={room} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ReadAllRoom;

import React, { useState } from "react";
import { handleImageError } from "../format";

// same form is used by CreateRoom and UpdateRoom
// room => starting values, onSubmit => what to do with data
const RoomForm = ({ room, onSubmit, buttonText }) => {
  let [title, setTitle] = useState(room.title || "");
  let [description, setDescription] = useState(room.description || "");
  let [rent, setRent] = useState(room.rent || "");
  let [location, setLocation] = useState(room.location || "");
  let [address, setAddress] = useState(room.address || "");
  let [roomType, setRoomType] = useState(room.roomType || "");
  let [image, setImage] = useState(room.image || "");
  let [available, setAvailable] = useState(room.available ?? true);
  let [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      title: title,
      description: description,
      rent: rent,
      location: location,
      address: address,
      roomType: roomType,
      image: image,
      available: available,
    };

    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="room-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. Sunny single room near college"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Monthly Rent (Rs.)</label>
          <input
            type="number"
            min="1"
            onChange={(e) => setRent(e.target.value)}
            value={rent}
            required
          />
        </div>
        <div className="form-group">
          <label>Room Type</label>
          <select
            onChange={(e) => setRoomType(e.target.value)}
            value={roomType}
            required
          >
            <option value="">Select type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="flat">Flat</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Location (area, city)</label>
          <input
            type="text"
            placeholder="e.g. Baneshwor, Kathmandu"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="e.g. Old Baneshwor, near Bhatbhateni"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          placeholder="Facilities, water, parking, rules..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
      </div>

      <div className="form-group">
        <label>Photo Link (optional)</label>
        <input
          type="url"
          placeholder="https://..."
          onChange={(e) => setImage(e.target.value)}
          value={image}
        />
        {image ? (
          <img
            key={image}
            className="image-preview"
            src={image}
            alt="Preview"
            onError={handleImageError}
          />
        ) : null}
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          onChange={(e) => setAvailable(e.target.checked)}
          checked={available}
        />
        Available for rent
      </label>

      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Saving..." : buttonText}
      </button>
    </form>
  );
};

export default RoomForm;

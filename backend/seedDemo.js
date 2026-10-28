// run => npm run seed:demo
// adds sample users, rooms and inquiries so the app does not look empty
// running again deletes old demo data (emails ending with @demo.com) and adds it fresh

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import connectToDb from "./src/connectToDb.js";
import Inquiry from "./src/schema/inquirySchema.js";
import Room from "./src/schema/roomSchema.js";
import User from "./src/schema/userSchema.js";

await connectToDb();

// remove old demo data
let oldUsers = await User.find({ email: /@demo\.com$/ });
let oldUserIds = oldUsers.map((user) => user._id);
let oldRooms = await Room.find({ owner: { $in: oldUserIds } });
let oldRoomIds = oldRooms.map((room) => room._id);
await Inquiry.deleteMany({
  $or: [{ room: { $in: oldRoomIds } }, { sender: { $in: oldUserIds } }],
});
await Room.deleteMany({ owner: { $in: oldUserIds } });
await User.deleteMany({ _id: { $in: oldUserIds } });

// all demo users have password => demo123
let password = await bcrypt.hash("demo123", 10);

let hari = await User.create({
  name: "Hari Shrestha",
  email: "hari@demo.com",
  password: password,
  phone: "9841000001",
});
let sita = await User.create({
  name: "Sita Gurung",
  email: "sita@demo.com",
  password: password,
  phone: "9841000002",
});
let ram = await User.create({
  name: "Ram Thapa",
  email: "ram@demo.com",
  password: password,
  phone: "9841000003",
});

let photo = (id) => `https://images.unsplash.com/${id}?w=800&q=60`;

let rooms = await Room.create([
  {
    title: "Sunny single room near college",
    description:
      "Bright room on the 2nd floor with a big window.\nAttached bathroom, 24 hours water, wifi included.\nSuitable for students.",
    rent: 7000,
    location: "Baneshwor, Kathmandu",
    address: "Old Baneshwor, near Bhatbhateni",
    roomType: "single",
    image: photo("photo-1522708323590-d24dbb6b0267"),
    owner: hari._id,
  },
  {
    title: "Spacious 2BHK flat with parking",
    description:
      "Two bedrooms, kitchen, living room and two bathrooms.\nBike and car parking. Quiet family neighbourhood.",
    rent: 28000,
    location: "Jhamsikhel, Lalitpur",
    address: "Jhamsikhel road, behind the school",
    roomType: "flat",
    image: photo("photo-1502672260266-1c1ef2d93688"),
    owner: hari._id,
  },
  {
    title: "Double room for two people",
    description:
      "Large room for two, shared kitchen on the same floor.\nClose to the bus stop and market.",
    rent: 12000,
    location: "New Baneshwor, Kathmandu",
    address: "Shankhamul road",
    roomType: "double",
    image: photo("photo-1505693416388-ac5ce068fe85"),
    owner: hari._id,
  },
  {
    title: "Furnished apartment with city view",
    description:
      "Fully furnished 3 bedroom apartment on the 6th floor.\nLift, backup power, security guard, rooftop access.",
    rent: 55000,
    location: "Lazimpat, Kathmandu",
    address: "Lazimpat, near the embassy area",
    roomType: "apartment",
    image: photo("photo-1560448204-e02f11c3d0e2"),
    owner: sita._id,
  },
  {
    title: "Budget single room",
    description: "Simple room, shared bathroom. Water and electricity included in rent.",
    rent: 5000,
    location: "Kirtipur, Kathmandu",
    address: "Near Tribhuvan University gate",
    roomType: "single",
    image: "",
    owner: sita._id,
  },
  {
    title: "1BHK flat near Bhaktapur Durbar Square",
    description:
      "One bedroom, kitchen and bathroom in a traditional house.\nPeaceful area, walking distance to Durbar Square.",
    rent: 15000,
    location: "Bhaktapur",
    address: "Taumadhi, Bhaktapur",
    roomType: "flat",
    image: photo("photo-1484154218962-a197022b5858"),
    owner: sita._id,
  },
  {
    title: "Room with balcony (already rented)",
    description: "Nice room with a private balcony. Currently rented.",
    rent: 9000,
    location: "Patan, Lalitpur",
    address: "Mangal Bazaar",
    roomType: "single",
    image: photo("photo-1493809842364-78817add7ffb"),
    available: false,
    owner: sita._id,
  },
]);

await Inquiry.create([
  {
    room: rooms[0]._id,
    sender: ram._id,
    message: "Hi, is this room still available? Can I visit this Saturday?",
    phone: ram.phone,
  },
  {
    room: rooms[3]._id,
    sender: ram._id,
    message: "Is the rent negotiable for a one year contract?",
    phone: ram.phone,
    status: "accepted",
  },
  {
    room: rooms[1]._id,
    sender: sita._id,
    message: "My family is looking for a flat from next month. Is parking free?",
    phone: sita.phone,
    status: "rejected",
  },
]);

console.log("demo data added:");
console.log("  users => hari@demo.com, sita@demo.com, ram@demo.com (password: demo123)");
console.log(`  rooms => ${rooms.length}, inquiries => 3`);

await mongoose.disconnect();

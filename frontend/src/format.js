// small helpers to show data nicely

// 7000 => Rs. 7,000
export let formatRent = (rent) => {
  return `Rs. ${Number(rent).toLocaleString("en-IN")}`;
};

// "flat" => "Flat"
export let formatRoomType = (roomType) => {
  return roomType ? roomType[0].toUpperCase() + roomType.slice(1) : "";
};

export let formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// show placeholder if room has no photo or photo link is broken
export let noImage = "/no-image.svg";

export let handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = noImage;
};

// inquiry status => badge color
export let statusClass = (status) => {
  if (status === "accepted") return "badge badge-green";
  if (status === "rejected") return "badge badge-red";
  return "badge badge-yellow";
};

const COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Kiambu", "Nakuru", "Uasin Gishu", "Machakos",
  "Kajiado", "Kilifi", "Meru", "Nyeri", "Kakamega", "Kisii", "Bungoma", "Kericho",
  "Laikipia", "Narok", "Embu", "Kitui", "Migori"
];

const COUNTY_COORDS = {
  Nairobi: [-1.2921, 36.8219],
  Mombasa: [-4.0435, 39.6682],
  Kisumu: [-0.0917, 34.7680],
  Kiambu: [-1.1714, 36.8356],
  Nakuru: [-0.3031, 36.0800],
  "Uasin Gishu": [0.5143, 35.2698],
  Machakos: [-1.5177, 37.2634],
  Kajiado: [-1.8500, 36.7800],
  Kilifi: [-3.6300, 39.8500],
  Meru: [0.0500, 37.6500],
  Nyeri: [-0.4200, 36.9500],
  Kakamega: [0.2827, 34.7519],
  Kisii: [-0.6817, 34.7660],
  Bungoma: [0.5635, 34.5606],
  Kericho: [-0.3670, 35.2830],
  Laikipia: [0.2050, 36.6620],
  Narok: [-1.0800, 35.8700],
  Embu: [-0.5390, 37.4500],
  Kitui: [-1.3670, 38.0100],
  Migori: [-1.0634, 34.4731]
};

const TRIBES = ["Kikuyu", "Luo", "Luhya", "Kalenjin", "Kamba", "Kisii", "Meru", "Mijikenda", "Maasai", "Somali", "Prefer not to say"];
const RELIGIONS = ["Christian", "Muslim", "Hindu", "Traditional", "Spiritual", "Prefer not to say"];
const INTERESTS = ["Hiking", "Gospel", "Afrobeats", "Football", "Rugby", "Cooking", "Church", "Startups", "Poetry", "Travel", "Farming", "Gym", "Art", "Coffee", "Road trips"];
const MODES = ["Open", "Student", "Professional", "Church"];

const PHOTOS = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80"
];

const BIOS = [
  "Nairobi evenings, nyama choma weekends. Looking for someone who can keep up on a hike and a debate.",
  "Mombasa soul. Beach walks, Swahili food, and slow Sundays.",
  "Building something in tech. Church on Sunday, coffee on Tuesday.",
  "Student by day, playlist curator by night. Sheng optional, kindness required.",
  "Farm-to-city kid. I miss home cooking and I will share the recipe.",
  "Professional mode during the week. Road trip to Naivasha when the calendar allows.",
  "Gospel, gym, and good conversation. No games — just say what you mean."
];

function seededPeople() {
  const names = [
    ["Amina", "F"], ["Brian", "M"], ["Wanjiku", "F"], ["Otieno", "M"], ["Faith", "F"],
    ["Kevin", "M"], ["Zawadi", "F"], ["Abel", "M"], ["Nyambura", "F"], ["Hassan", "M"],
    ["Lydia", "F"], ["Collins", "M"], ["Imani", "F"], ["Samuel", "M"], ["Mercy", "F"],
    ["Juma", "M"], ["Naomi", "F"], ["Peter", "M"]
  ];
  return names.map((n, i) => {
    const county = COUNTIES[i % COUNTIES.length];
    const [lat, lng] = COUNTY_COORDS[county];
    return {
      id: "p" + i,
      name: n[0],
      gender: n[1],
      age: 22 + (i % 14),
      county,
      town: county,
      lat: lat + (i % 5) * 0.02,
      lng: lng + (i % 4) * 0.02,
      tribe: TRIBES[i % TRIBES.length],
      religion: RELIGIONS[i % RELIGIONS.length],
      mode: MODES[i % MODES.length],
      interests: INTERESTS.slice(i % 5, (i % 5) + 4),
      bio: BIOS[i % BIOS.length],
      photo: PHOTOS[i % PHOTOS.length],
      premium: i % 4 === 0
    };
  });
}

const PEOPLE = seededPeople();

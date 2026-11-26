export type Point = readonly [longitude: number, latitude: number];
export type Mode = "train" | "bus" | "car";

interface City {
  name: string;
  korean: string;
  point: Point;
  rail: string;
  roadVia: Point[];
  railVia: Point[];
  terminal: string;
  busConnection?: string;
}

const daejeon: Point = [127.44, 36.34];
const gimcheon: Point = [128.12, 36.12];
const cheonanAsan: Point = [127.104, 36.794];
const suwon: Point = [127.001, 37.265];
const seoulStation: Point = [126.971, 37.554];
const miryang: Point = [128.77, 35.474];
const northCorridor: Point[] = [daejeon, gimcheon];

export const cities: City[] = [
  {
    name: "Busan", korean: "부산", point: [129.076, 35.180],
    rail: "From Busan Station, look for a KTX service to Dongdaegu.",
    railVia: [[129.041, 35.116], [129.138, 35.548], [129.119, 35.818]],
    terminal: "Busan Central Bus Terminal (Nopo)",
    roadVia: [[129.086, 35.28], [129.02, 35.37], miryang, [128.73, 35.72]],
  },
  {
    name: "Seoul", korean: "서울", point: [126.978, 37.566],
    rail: "Search KTX from Seoul Station to Dongdaegu Station.",
    railVia: [seoulStation, [126.885, 37.416], cheonanAsan, ...northCorridor],
    terminal: "Seoul Express Bus Terminal (Gyeongbu side)",
    roadVia: [[127.09, 37.39], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Incheon", korean: "인천", point: [126.705, 37.456],
    rail: "Take local transit to Seoul Station, then look for a KTX to Dongdaegu.",
    railVia: [[126.84, 37.52], seoulStation, [126.885, 37.416], cheonanAsan, ...northCorridor],
    terminal: "Incheon Bus Terminal",
    roadVia: [[126.82, 37.38], [127.08, 37.25], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Gumi", korean: "구미", point: [128.344, 36.120],
    rail: "Search for an ITX or Mugunghwa service from Gumi Station to Dongdaegu.",
    railVia: [[128.332, 36.129], [128.397, 35.991], [128.51, 35.89]],
    terminal: "Gumi Bus Terminal",
    busConnection: "If your date has no Dongdaegu coach, check Gumi–Daegu services to another terminal and plan the local connection in KakaoMap.",
    roadVia: [[128.409, 36.073], [128.48, 35.957], [128.547, 35.922]],
  },
  {
    name: "Suwon", korean: "수원", point: [127.029, 37.264],
    rail: "Search from Suwon Station to Dongdaegu. Compare direct trains with transfer options.",
    railVia: [suwon, [127.14, 36.81], ...northCorridor],
    terminal: "Suwon Bus Terminal",
    roadVia: [[127.10, 37.23], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Ansan", korean: "안산", point: [126.831, 37.322],
    rail: "Take local transit to Suwon Station, then search for trains to Dongdaegu.",
    railVia: [[126.93, 37.29], suwon, [127.14, 36.81], ...northCorridor],
    terminal: "Ansan Bus Terminal",
    busConnection: "Check Ansan Bus Terminal for Daegu services. If no suitable coach is listed, compare departures from Suwon.",
    roadVia: [[126.94, 37.27], [127.08, 37.20], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Gimhae", korean: "김해", point: [128.889, 35.228],
    rail: "Use local transit to Jinyeong Station, then check trains to Dongdaegu.",
    railVia: [[128.77, 35.285], miryang, [128.76, 35.65]],
    terminal: "Gimhae Passenger Terminal",
    busConnection: "Check Gimhae Passenger Terminal for Daegu services. If no suitable coach is listed, compare Changwon or Busan departures.",
    roadVia: [[128.87, 35.30], [128.80, 35.41], miryang, [128.72, 35.70]],
  },
  {
    name: "Changwon", korean: "창원", point: [128.681, 35.228],
    rail: "Search from Changwon Jungang or Masan Station to Dongdaegu.",
    railVia: [[128.705, 35.244], [128.77, 35.285], miryang, [128.76, 35.65]],
    terminal: "Changwon Bus Terminal",
    roadVia: [[128.65, 35.33], [128.55, 35.47], [128.46, 35.70], [128.51, 35.82]],
  },
  {
    name: "Cheonan", korean: "천안", point: [127.152, 36.815],
    rail: "Start at Cheonan–Asan Station for high-speed trains to Dongdaegu.",
    railVia: [cheonanAsan, ...northCorridor],
    terminal: "Cheonan Express or Intercity Bus Terminal",
    roadVia: [[127.18, 36.75], ...northCorridor],
  },
  {
    name: "Jincheon", korean: "진천", point: [127.435, 36.856],
    rail: "Take local transit to Osong Station, then search for a high-speed train to Dongdaegu.",
    railVia: [[127.327, 36.620], ...northCorridor],
    terminal: "Jincheon Bus Terminal",
    busConnection: "Check Jincheon departures for Daegu. Compare a connection via Cheongju or Daejeon if needed.",
    roadVia: [[127.48, 36.67], ...northCorridor],
  },
  {
    name: "Gwangju", korean: "광주", point: [126.852, 35.160],
    rail: "Check Gwangju-Songjeong to Dongdaegu with a transfer at Osong.",
    railVia: [[126.791, 35.138], [126.87, 35.57], [126.94, 35.94], [127.327, 36.620], ...northCorridor],
    terminal: "Gwangju U-Square Bus Terminal",
    roadVia: [[127.05, 35.32], [127.43, 35.42], [127.87, 35.65], [128.40, 35.79]],
  },
  {
    name: "Cheongju", korean: "청주", point: [127.489, 36.642],
    rail: "Take local transit to Osong Station and check KTX services to Dongdaegu.",
    railVia: [[127.327, 36.620], ...northCorridor],
    terminal: "Cheongju Express or Intercity Bus Terminal",
    roadVia: [[127.43, 36.49], ...northCorridor],
  },
  {
    name: "Hwaseong", korean: "화성", point: [126.832, 37.200],
    rail: "Check SRT from Dongtan Station to Dongdaegu, or compare trains from Suwon.",
    railVia: [[127.088, 37.200], cheonanAsan, ...northCorridor],
    terminal: "Suwon Bus Terminal",
    busConnection: "Take local transit to Suwon Bus Terminal, then search for a coach to Daegu.",
    roadVia: [[127.08, 37.20], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Ulsan", korean: "울산", point: [129.311, 35.539],
    rail: "Use local transit to Ulsan KTX Station in Ulju, then search for a train to Dongdaegu.",
    railVia: [[129.138, 35.548], [129.119, 35.818]],
    terminal: "Ulsan Express or Intercity Bus Terminal",
    roadVia: [[129.13, 35.63], [129.10, 35.83], [128.86, 35.87]],
  },
  {
    name: "Paju", korean: "파주", point: [126.780, 37.760],
    rail: "Take local transit to Seoul Station, then check KTX services to Dongdaegu.",
    railVia: [seoulStation, [126.885, 37.416], cheonanAsan, ...northCorridor],
    terminal: "Seoul Express Bus Terminal",
    busConnection: "Travel to Seoul Express Bus Terminal, then check Daegu-bound coaches.",
    roadVia: [[126.88, 37.57], [127.09, 37.39], [127.18, 36.83], ...northCorridor],
  },
  {
    name: "Gimje", korean: "김제", point: [126.881, 35.804],
    rail: "Search Gimje to Dongdaegu with a transfer. Compare departures from nearby Iksan.",
    railVia: [[126.95, 35.94], [127.327, 36.620], ...northCorridor],
    terminal: "Gimje Bus Terminal",
    busConnection: "Check Gimje departures first. Compare connecting services via Jeonju if needed.",
    roadVia: [[127.12, 35.83], [127.61, 35.87], [127.87, 35.65], [128.40, 35.79]],
  },
  {
    name: "Jeonju", korean: "전주", point: [127.148, 35.825],
    rail: "Search from Jeonju Station to Dongdaegu. Compare connections through Osong.",
    railVia: [[126.95, 35.94], [127.327, 36.620], ...northCorridor],
    terminal: "Jeonju Express or Intercity Bus Terminal",
    roadVia: [[127.61, 35.87], [127.87, 35.65], [128.40, 35.79]],
  },
  {
    name: "Chuncheon", korean: "춘천 · 강원도", point: [127.730, 37.881],
    rail: "From Chuncheon in Gangwon-do, compare a connection via Yongsan and a KTX to Dongdaegu.",
    railVia: [[127.1, 37.59], [126.965, 37.529], cheonanAsan, ...northCorridor],
    terminal: "Chuncheon Intercity Bus Terminal",
    roadVia: [[127.91, 37.35], [128.21, 37.13], [128.20, 36.60], [128.15, 36.34]],
  },
  {
    name: "Pohang", korean: "포항", point: [129.343, 36.019],
    rail: "Search for KTX from Pohang Station to Dongdaegu.",
    railVia: [[129.341, 36.071], [129.14, 35.86], [128.80, 35.84]],
    terminal: "Pohang Intercity Bus Terminal",
    roadVia: [[129.15, 36.07], [128.93, 35.98], [128.73, 35.90]],
  },
  {
    name: "Jinju", korean: "진주", point: [128.108, 35.181],
    rail: "Search Jinju Station to Dongdaegu and compare direct KTX with connecting services.",
    railVia: [[128.118, 35.151], [128.58, 35.24], miryang, [128.76, 35.65]],
    terminal: "Jinju Express or Intercity Bus Terminal",
    roadVia: [[128.23, 35.27], [128.42, 35.44], [128.43, 35.74]],
  },
  {
    name: "Wonju", korean: "원주", point: [127.920, 37.342],
    rail: "Compare rail connections to Daegu via Seoul with intercity coach options.",
    railVia: [[127.82, 37.36], [127.22, 37.53], seoulStation, cheonanAsan, ...northCorridor],
    terminal: "Wonju Intercity Bus Terminal",
    roadVia: [[128.21, 37.13], [128.20, 36.60], [128.15, 36.34]],
  },
  {
    name: "Chungju", korean: "충주", point: [127.926, 36.991],
    rail: "Compare trains from Chungju with a transfer at Bubal for travel via Seoul.",
    railVia: [[127.49, 37.27], [127.11, 37.40], seoulStation, cheonanAsan, ...northCorridor],
    terminal: "Chungju Public Bus Terminal",
    roadVia: [[128.06, 36.78], [128.16, 36.52], [128.15, 36.34]],
  },
];

export const venue = {
  name: "Yeungjin University",
  korean: "영진전문대학교",
  address: "대구광역시 북구 복현로 35 (영진전문대학교)",
  point: [128.622, 35.896] as Point,
};

export const dongdaegu: Point = [128.628, 35.880];
export const campusDirections = "https://kcenter.yju.ac.kr/guidance/directions";
export const trainTickets = "https://smart.letskorail.com/ebizbf/EbizBfTicketSearchM.do";
export const expressBusTickets = "https://www.kobus.co.kr/main.do";
export const intercityBusTickets = "https://intercitybuse.tmoney.co.kr/";

export function straightLineKm([lon, lat]: Point, [endLon, endLat]: Point) {
  const radians = Math.PI / 180;
  const a = Math.sin((endLat - lat) * radians / 2) ** 2
    + Math.cos(lat * radians) * Math.cos(endLat * radians)
    * Math.sin((endLon - lon) * radians / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function kakaoRoute(city: City, mode: Mode) {
  const location = (name: string, [lon, lat]: Point) =>
    encodeURIComponent(name) + "," + lat + "," + lon;
  const method = mode === "car" ? "car" : "publictransit";
  return "https://map.kakao.com/link/by/" + method + "/" +
    location(city.korean, city.point) + "/" + location(venue.korean, venue.point);
}

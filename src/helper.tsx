

export const formatToUKTime = (isoString) => {
    const ukFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  if (!isoString) return[];
    const date = new Date(isoString);
    const parts = ukFormatter.formatToParts(date);
  
    const getPart = (type) => parts.find(part => part.type === type)?.value || '';
  
    const weekday = getPart('weekday');
    const month = getPart('month');
    const day = getPart('day');
    const year = getPart('year');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const dayPeriod = getPart('dayPeriod');
  
    return [`${weekday} ${month} ${day} ${year}`,`${hour}:${minute} ${dayPeriod}` ];
  }
  
export const flattenStops = (data) => {
    return data.reduce((acc, item) => {
      if (Array.isArray(item.stops)) {
        acc.push(...item.stops);
      }
      return acc;
    }, []);
  }
  
  export const stops=  [
    {
        "time": "2025-03-30T20:30:16.983Z",
        "description": "131 Kennington Rd, Nottingham NG8 1QE, UK",
        "lng": -1.187526,
        "name": "131 Kennington Rd",
        "id": "0a848a11-74ba-3e41-4bca-f37d59437cc2",
        "place_id": "ChIJE8-5X_fBeUgRSns08QvTGV0",
        "lat": 52.9581074,
        "status": "failed"
    },
    {
        "lng": -1.1833091,
        "place_id": "ChIJ_6PWE_HBeUgRKpZH2Q5FxsY",
        "id": "cb2b7953-7330-dc78-8e2e-a3501e5b4ffb",
        "description": "8 Fleet Cl, Nottingham NG7 5RY, UK",
        "name": "8 Fleet Cl",
        "time": "2025-03-30T16:48:06.164Z",
        "status": "completed",
        "lat": 52.961298
    },
    {
        "lng": -1.172562,
        "status": "completed",
        "place_id": "ChIJd4NQkorBeUgR6gwJTpSC4Lo",
        "id": "55c68191-4bdc-22ab-b0f2-2644a79162d1",
        "name": "115 Rothesay Ave",
        "time": "2025-03-30T16:36:23.996Z",
        "description": "115 Rothesay Ave, Nottingham NG7 1PW, UK",
        "lat": 52.9553448
    },
    {
        "time": "2025-03-30T16:31:26.004Z",
        "id": "77180cdc-0f81-d5e1-d7bd-3ff18a54d2a1",
        "lng": -1.1629896,
        "status": "completed",
        "place_id": "ChIJs12hrYjBeUgRVq-3NEPW9XA",
        "lat": 52.9594754,
        "name": "5 Francis St",
        "description": "5 Francis St, Nottingham NG7 4GB, UK"
    },
    {
        "place_id": "ChIJOTvWAYLBeUgR1P4NOH3DSM0",
        "status": "completed",
        "lng": -1.1504652,
        "time": "2025-03-30T16:24:51.676Z",
        "id": "659a7a02-c877-7fe3-da73-c82d5729897a",
        "lat": 52.9598381,
        "name": "YMCA International Community Centre",
        "description": "61B Mansfield Rd, Nottingham NG1 3FN, UK"
    },
    {
        "description": "9-11 Watcombe Circus, Carrington, Nottingham NG5 2DU, UK",
        "place_id": "ChIJ6Xx6IaDBeUgRBnD_I7xHqoI",
        "status": "completed",
        "lat": 52.9761607,
        "time": "2025-03-30T16:17:21.255Z",
        "id": "d3f8989c-1d9c-3de5-a760-0f73ad68ce66",
        "name": "9-11 Watcombe Circus",
        "lng": -1.1522714
    },
    {
        "name": "3 Glamis Rd",
        "status": "completed",
        "description": "3 Glamis Rd, Nottingham NG5 1ED, UK",
        "place_id": "ChIJIcbyi7zBeUgRqIxBmTbqNQM",
        "lng": -1.1659904,
        "time": "2025-03-30T16:12:28.140Z",
        "id": "d4990acc-f491-0abb-89a7-184c5a997809",
        "lat": 52.9800323
    },
    {
        "time": "2025-03-30T15:57:51.569Z",
        "status": "completed",
        "id": "113b45d4-04bb-fc42-7396-d9ef9e08eb3d",
        "lat": 53.0003761,
        "place_id": "ChIJZQP3V9bAeUgRPS4QS9zT06s",
        "description": "5 Gorman Ct, Arnold, Nottingham NG5 7LR, UK",
        "lng": -1.1094795,
        "name": "5 Gorman Ct"
    },
    {
        "lat": 52.9930318,
        "lng": -1.1515154,
        "id": "db5a4a13-ec40-2f09-7183-1ddc861927ff",
        "name": "170 Edwards Ln",
        "place_id": "ChIJ-d0HDKrBeUgREy55mQyfZts",
        "description": "170 Edwards Ln, Nottingham NG5 3HZ, UK",
        "status": "completed",
        "time": "2025-03-30T15:48:45.656Z"
    },
    {
        "lat": 52.99649660000001,
        "name": "8 Raymede Cl",
        "time": "2025-03-30T15:40:34.817Z",
        "id": "5e0671b4-a1ad-123d-a984-37be9b774e73",
        "description": "8 Raymede Cl, Nottingham NG5 5FW, UK",
        "status": "completed",
        "lng": -1.1727072,
        "place_id": "EiQ4IFJheW1lZGUgQ2wsIE5vdHRpbmdoYW0gTkc1IDVGVywgVUsiMBIuChQKEgkjSlbXtMF5SBFlIgm9tTW1PhAIKhQKEgnNn8HXtMF5SBH0E-BjN5hk9Q"
    },
    {
        "place_id": "ChIJ75_g37nBeUgRolYzL31dTuc",
        "description": "14 Tunstall Dr, Nottingham NG6 0FN, UK",
        "lng": -1.171395,
        "id": "5b7d547e-8409-50e4-c5fe-18766246d4ad",
        "status": "completed",
        "name": "14 Tunstall Dr",
        "lat": 52.9863261,
        "time": "2025-03-30T15:31:48.235Z"
    },
    {
        "id": "57def599-dbc8-ddae-441d-55e096b3ef79",
        "description": "86 Highbury Rd, Nottingham NG6 9DQ, UK",
        "place_id": "ChIJ4ZmCftLBeUgRy9wxQ_sK73o",
        "name": "86 Highbury Rd",
        "time": "2025-03-30T15:25:31.964Z",
        "status": "completed",
        "lng": -1.18954,
        "lat": 52.994087
    },
    {
        "status": "completed",
        "description": "19 Bullfinch Rd, Nottingham NG6 0NJ, UK",
        "lat": 52.9866973,
        "lng": -1.1867652,
        "place_id": "EicxOSBCdWxsZmluY2ggUmQsIE5vdHRpbmdoYW0gTkc2IDBOSiwgVUsiMBIuChQKEgmhXwqSz8F5SBHZPBX6Kt6urxATKhQKEgn_CsyNz8F5SBEu7g7NY6S3fw",
        "id": "ed4fd345-7a6a-a166-f0f7-24e40a7dc679",
        "name": "19 Bullfinch Rd",
        "time": "2025-03-30T15:18:26.964Z"
    },
    {
        "description": "400 Aspley Ln, Aspley, Nottingham NG8 5RS, UK",
        "lng": -1.2017373,
        "place_id": "ChIJddMbZQrqeUgRWlPwQu-q_fI",
        "id": "a8bf3fc4-3ab4-50bc-44a0-f6575b23f981",
        "name": "400 Aspley Ln",
        "time": "2025-03-30T15:09:24.053Z",
        "status": "completed",
        "lat": 52.972160599999995
    },
    {
        "place_id": "ChIJQW7fpWzqeUgRGTTg13i8QG0",
        "lat": 52.9759795,
        "time": "2025-03-30T15:04:44.817Z",
        "id": "18bde3c4-9f77-cc49-c492-81e1def181cd",
        "lng": -1.2195845,
        "status": "completed",
        "name": "66 Frinton Rd",
        "description": "66 Frinton Rd, Nottingham NG8 6GQ, UK"
    },
    {
        "description": "182 Woodfield Rd, Nottingham NG8 6HU, UK",
        "lat": 52.9788288,
        "id": "853b0a85-77f7-c005-fc63-58ab95f174c4",
        "status": "completed",
        "lng": -1.2208846,
        "name": "182 Woodfield Rd",
        "place_id": "ChIJG2wbjmvqeUgRbo4QmHNwrNg",
        "time": "2025-03-30T15:01:06.481Z"
    },
    {
        "name": "49 Melford Rd",
        "description": "49 Melford Rd, Nottingham NG8 4AP, UK",
        "place_id": "ChIJ1xsTuT3qeUgRdeNjoSvLUIE",
        "id": "afb1fd25-9b2b-ae04-e797-15f5d5a08828",
        "time": "2025-03-30T14:53:16.034Z",
        "lat": 52.968169599999996,
        "lng": -1.2280640999999999,
        "status": "completed"
    },
    {
        "time": "2025-03-30T14:48:13.452Z",
        "description": "46 Kinross Cres, Nottingham NG8 3FU, UK",
        "place_id": "ChIJBxyr1wXqeUgRbq4HqUEjy2w",
        "name": "46 Kinross Cres",
        "lat": 52.9624238,
        "status": "completed",
        "lng": -1.2069049,
        "id": "f96cc1dd-ee97-4ba0-99ac-e1a4ec38f5db"
    },
    {
        "place_id": "ChIJbVDpLgTqeUgRh-MLzMLMwE4",
        "status": "completed",
        "lng": -1.2071904,
        "time": "2025-03-30T14:45:32.549Z",
        "id": "961b10cf-ed6f-d419-ef76-5cc8c2711f5a",
        "description": "99 Hollington Rd, Nottingham NG8 3HP, UK",
        "name": "99 Hollington Rd",
        "lat": 52.9614499
    },
    {
        "name": "90 Felstead Rd",
        "lat": 52.9603017,
        "id": "d10e42de-95f3-8c7a-692e-a70e27f78006",
        "time": "2025-03-30T14:42:37.347Z",
        "status": "completed",
        "place_id": "ChIJRdIrQQfqeUgRVgNQol2hDM0",
        "lng": -1.2016701,
        "description": "90 Felstead Rd, Nottingham NG8 3HF, UK"
    },
    {
        "place_id": "EiVXZXN0aG9sbWUgR2FyZGVucywgTm90dGluZ2hhbSBORzgsIFVLIi4qLAoUChIJee0RDvvBeUgRJq4GFLkIeC8SFAoSCdN36QmPxnlIEQ3BhHPcd8vM",
        "name": "Westholme Gardens",
        "time": "2025-03-30T14:35:28.344Z",
        "lng": -1.1912053,
        "description": "Westholme Gardens, Nottingham NG8, UK",
        "id": "be68b21b-f1ba-fe70-7ac5-d5beae711f87",
        "lat": 52.962622,
        "status": "completed"
    },
    {
        "id": "0eba6a02-7c85-09e5-983c-d754aee3a685",
        "status": "completed",
        "place_id": "ChIJIQ-LhvDBeUgR3rRLEEZY9Eo",
        "description": "19 Northdown Rd, Nottingham NG8 3PF, UK",
        "name": "19 Northdown Rd",
        "lng": -1.1871211,
        "time": "2025-03-30T14:32:12.735Z",
        "lat": 52.9618645
    },
    {
        "status": "completed",
        "lat": 52.96132,
        "name": "23 Vale Cres N",
        "place_id": "ChIJT9pkkPDBeUgR-yEMZKkzO8Q",
        "id": "5b6dada9-db4b-3957-34fd-a87f950c0944",
        "description": "23 Vale Cres N, Nottingham NG8 3PR, UK",
        "lng": -1.1868417,
        "time": "2025-03-30T14:28:38.359Z"
    }
];
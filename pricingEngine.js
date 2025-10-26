export function estimatePrice({ area, surfaceType, uneven }) {
  const pricingTable = [
  {
    "min": 10,
    "max": 12,
    "existing_lawn": 325.0,
    "bare_soil": 300.0,
    "prepped_surface": 280.0
  },
  {
    "min": 13,
    "max": 14,
    "existing_lawn": 375.0,
    "bare_soil": 325.0,
    "prepped_surface": 315.0
  },
  {
    "min": 15,
    "max": 16,
    "existing_lawn": 415.0,
    "bare_soil": 375.0,
    "prepped_surface": 340.0
  },
  {
    "min": 17,
    "max": 19,
    "existing_lawn": 465.0,
    "bare_soil": 415.0,
    "prepped_surface": 375.0
  },
  {
    "min": 20,
    "max": 22,
    "existing_lawn": 515.0,
    "bare_soil": 465.0,
    "prepped_surface": 410.0
  },
  {
    "min": 23,
    "max": 26,
    "existing_lawn": 565.0,
    "bare_soil": 500.0,
    "prepped_surface": 445.0
  },
  {
    "min": 27,
    "max": 29,
    "existing_lawn": 620.0,
    "bare_soil": 565.0,
    "prepped_surface": 465.0
  },
  {
    "min": 30,
    "max": 34,
    "existing_lawn": 665.0,
    "bare_soil": 620.0,
    "prepped_surface": 515.0
  },
  {
    "min": 35,
    "max": 39,
    "existing_lawn": 725.0,
    "bare_soil": 675.0,
    "prepped_surface": 565.0
  },
  {
    "min": 40,
    "max": 44,
    "existing_lawn": 765.0,
    "bare_soil": 735.0,
    "prepped_surface": 615.0
  },
  {
    "min": 45,
    "max": 49,
    "existing_lawn": 815.0,
    "bare_soil": 775.0,
    "prepped_surface": 665.0
  },
  {
    "min": 50,
    "max": 54,
    "existing_lawn": 885.0,
    "bare_soil": 815.0,
    "prepped_surface": 695.0
  },
  {
    "min": 55,
    "max": 59,
    "existing_lawn": 945.0,
    "bare_soil": 895.0,
    "prepped_surface": 735.0
  },
  {
    "min": 60,
    "max": 64,
    "existing_lawn": 995.0,
    "bare_soil": 945.0,
    "prepped_surface": 765.0
  },
  {
    "min": 65,
    "max": 69,
    "existing_lawn": 1025.0,
    "bare_soil": 995.0,
    "prepped_surface": 795.0
  },
  {
    "min": 70,
    "max": 74,
    "existing_lawn": 1135.0,
    "bare_soil": 1025.0,
    "prepped_surface": 845.0
  },
  {
    "min": 75,
    "max": 79,
    "existing_lawn": 1175.0,
    "bare_soil": 1135.0,
    "prepped_surface": 895.0
  },
  {
    "min": 80,
    "max": 84,
    "existing_lawn": 1235.0,
    "bare_soil": 1175.0,
    "prepped_surface": 925.0
  },
  {
    "min": 85,
    "max": 89,
    "existing_lawn": 1295.0,
    "bare_soil": 1235.0,
    "prepped_surface": 985.0
  },
  {
    "min": 90,
    "max": 94,
    "existing_lawn": 1385.0,
    "bare_soil": 1295.0,
    "prepped_surface": 1035.0
  },
  {
    "min": 95,
    "max": 99,
    "existing_lawn": 1415.0,
    "bare_soil": 1385.0,
    "prepped_surface": 1065.0
  },
  {
    "min": 100,
    "max": 109,
    "existing_lawn": 1495.0,
    "bare_soil": 1415.0,
    "prepped_surface": 1095.0
  },
  {
    "min": 110,
    "max": 119,
    "existing_lawn": 1545.0,
    "bare_soil": 1495.0,
    "prepped_surface": 1175.0
  },
  {
    "min": 120,
    "max": 129,
    "existing_lawn": 1625.0,
    "bare_soil": 1545.0,
    "prepped_surface": 1225.0
  },
  {
    "min": 130,
    "max": 139,
    "existing_lawn": 1675.0,
    "bare_soil": 1625.0,
    "prepped_surface": 1285.0
  },
  {
    "min": 140,
    "max": 149,
    "existing_lawn": 1725.0,
    "bare_soil": 1675.0,
    "prepped_surface": 1325.0
  },
  {
    "min": 150,
    "max": 159,
    "existing_lawn": 1795.0,
    "bare_soil": 1725.0,
    "prepped_surface": 1395.0
  },
  {
    "min": 160,
    "max": 169,
    "existing_lawn": 1885.0,
    "bare_soil": 1795.0,
    "prepped_surface": 1465.0
  },
  {
    "min": 170,
    "max": 179,
    "existing_lawn": 1995.0,
    "bare_soil": 1885.0,
    "prepped_surface": 1565.0
  },
  {
    "min": 180,
    "max": 189,
    "existing_lawn": 2095.0,
    "bare_soil": 1995.0,
    "prepped_surface": 1665.0
  },
  {
    "min": 190,
    "max": 200,
    "existing_lawn": 2195.0,
    "bare_soil": 2095.0,
    "prepped_surface": 1765.0
  },
  {
    "min": 200,
    "max": 399,
    "existing_lawn": 10.35,
    "bare_soil": 9.75,
    "prepped_surface": 8.35
  },
  {
    "min": 400,
    "max": 599,
    "existing_lawn": 9.75,
    "bare_soil": 9.4,
    "prepped_surface": 7.95
  },
  {
    "min": 600,
    "max": 999,
    "existing_lawn": 9.4,
    "bare_soil": 9.25,
    "prepped_surface": 7.65
  },
  {
    "min": 1000,
    "max": 1499,
    "existing_lawn": 9.25,
    "bare_soil": 8.95,
    "prepped_surface": 7.5
  }
];

const band = pricingTable.find(
    (b) => area >= b.min && area <= b.max
  );

  if (!band) {
    return {
      estimate: null,
      comment: `Could not find pricing band for ${area}m². Please fill out the form: https://www.thelawnturflaying.co.uk/get-a-quote-for-turf-laying-fitting-garden-turf/`
    };
  }

  const estimate = band[surfaceType];

  if (!estimate) {
    return {
      estimate: null,
      comment: `No price available for surface type: ${surfaceType}`
    };
  }

  let comment = `Estimated price for ${area}m² over ${surfaceType.replace('_', ' ')} is £${estimate}.`;

  if (uneven) {
    comment += ' Note: area is very uneven, extra topsoil *might* be needed.';
  }

  comment += ' Please fill out the form for an accurate quote: https://www.thelawnturflaying.co.uk/get-a-quote-for-turf-laying-fitting-garden-turf/';

  return { estimate, comment };
}